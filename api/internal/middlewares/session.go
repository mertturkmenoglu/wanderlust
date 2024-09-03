package middlewares

import (
	"wanderlust/config"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

func GetSessionMiddleware() echo.MiddlewareFunc {
	cookieSecret := viper.GetString(config.AUTH_SIGN_KEY)

	return session.Middleware(sessions.NewCookieStore([]byte(cookieSecret)))
}
