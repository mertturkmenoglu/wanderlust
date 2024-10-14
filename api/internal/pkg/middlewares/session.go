package middlewares

import (
	"wanderlust/internal/pkg/config"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

func GetSessionMiddleware(cfg *config.Configuration) echo.MiddlewareFunc {
	cookieSecret := cfg.GetString(config.AUTH_SIGN_KEY)
	return session.Middleware(sessions.NewCookieStore([]byte(cookieSecret)))
}
