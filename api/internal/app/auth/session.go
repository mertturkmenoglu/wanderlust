package auth

import (
	"net/http"
	"wanderlust/config"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

func getAuthSessionOptions() *sessions.Options {
	return &sessions.Options{
		Path:     viper.GetString(config.AUTH_SESSION_PATH),
		MaxAge:   viper.GetInt(config.AUTH_SESSION_MAX_AGE),
		HttpOnly: true,
		Secure:   viper.GetString(config.ENV) != "dev",
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
