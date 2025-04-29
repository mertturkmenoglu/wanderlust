package auth

import (
	"net/http"
	"wanderlust/internal/pkg/cfg"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func getAuthSessionOptions() *sessions.Options {
	return &sessions.Options{
		Path:     cfg.Get(cfg.API_AUTH_SESSION_PATH),
		MaxAge:   cfg.GetInt(cfg.API_AUTH_SESSION_MAX_AGE),
		HttpOnly: true,
		Secure:   cfg.Get(cfg.ENV) != "dev",
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
