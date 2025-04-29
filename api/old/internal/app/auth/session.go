package auth

import (
	"net/http"
	"wanderlust/internal/pkg/config"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func getAuthSessionOptions() *sessions.Options {
	cfg := config.GetConfiguration()

	return &sessions.Options{
		Path:     cfg.GetString(config.AUTH_SESSION_PATH),
		MaxAge:   cfg.GetInt(config.AUTH_SESSION_MAX_AGE),
		HttpOnly: true,
		Secure:   cfg.GetString(config.ENV) != "dev",
		SameSite: http.SameSiteLaxMode,
	}
}

func mustGetAuthSession(c echo.Context) *sessions.Session {
	sess, err := session.Get(SESSION_NAME, c)

	if err != nil {
		panic(err)
	}

	return sess
}
