package middlewares

import (
	"context"
	"errors"

	"net/http"
	"time"
	"wanderlust/internal/cookies"
	"wanderlust/internal/db"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

const SESSION_NAME = "__wanderlust_auth"

var (
	errInvalidState   = errors.New("invalid session state")
	errInvalidSession = errors.New("invalid session")
	errSessionExpired = errors.New("session expired")
)

// IsAuth checks if the user is authenticated or not.
// If the user is authenticated, it sets the user_id in the context.
// If the user is not authenticated, it throws an HTTP 401 StatusUnauthorized error.
func IsAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, err := session.Get(SESSION_NAME, c)

		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, errInvalidState.Error())
		}

		userId, sessionId, ok := getValuesFromSession(sess)

		if !ok || sessionId == "" || userId == "" {
			cookies.DeleteSessionCookie(c)

			return echo.NewHTTPError(http.StatusUnauthorized, errInvalidSession.Error())
		}

		s, err := getDb().Queries.GetSessionById(context.Background(), sessionId)

		if err != nil {
			cookies.DeleteSessionCookie(c)

			return echo.NewHTTPError(http.StatusUnauthorized, errInvalidSession.Error())
		}

		// Check if the session belongs to the user
		if s.Session.UserID != userId {
			cookies.DeleteSessionCookie(c)

			return echo.NewHTTPError(http.StatusUnauthorized, errInvalidSession.Error())
		}

		// Check if the session is expired
		if s.Session.ExpiresAt.Time.Before(time.Now()) {
			cookies.DeleteSessionCookie(c)

			return echo.NewHTTPError(http.StatusUnauthorized, errSessionExpired.Error())
		}

		c.Set("user_id", userId)
		c.Set("session_id", sessionId)
		c.Set("session_data", s.Session.SessionData)
		c.Set("user", s.User)

		return next(c)
	}
}

// WithAuth checks if the user is authenticated or not.
// If the user is authenticated, it sets the user_id in the context.
// If the user is not authenticated, it sets the user_id to an empty string.
func WithAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, err := session.Get(SESSION_NAME, c)

		if err != nil {
			setContextValuesEmpty(c)
			return next(c)
		}

		userId, sessionId, ok := getValuesFromSession(sess)

		if !ok || userId == "" || sessionId == "" {
			setContextValuesEmpty(c)
			return next(c)
		}

		s, err := getDb().Queries.GetSessionById(context.Background(), sessionId)
		ok = err == nil && s.Session.UserID == userId && s.Session.ExpiresAt.Time.After(time.Now())

		if !ok {
			setContextValuesEmpty(c)
			return next(c)
		}

		c.Set("user_id", userId)
		c.Set("session_id", sessionId)
		c.Set("session_data", s.Session.SessionData)
		c.Set("user", s.User)

		return next(c)
	}
}

func getValuesFromSession(sess *sessions.Session) (userId string, sessionId string, ok bool) {
	userId, userOk := sess.Values["user_id"].(string)
	sessionId, sessionOk := sess.Values["session_id"].(string)
	ok = userOk && sessionOk
	return userId, sessionId, ok
}

func setContextValuesEmpty(c echo.Context) {
	c.Set("user_id", "")
	c.Set("session_id", "")
	c.Set("session_data", "")
	c.Set("user", db.User{})
}
