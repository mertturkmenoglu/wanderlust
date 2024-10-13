package middlewares

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Cors() echo.MiddlewareFunc {
	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:                             middleware.DefaultCORSConfig.AllowOrigins,
		AllowMethods:                             middleware.DefaultCORSConfig.AllowMethods,
		AllowHeaders:                             middleware.DefaultCORSConfig.AllowHeaders,
		AllowCredentials:                         true,
		UnsafeWildcardOriginWithAllowCredentials: true,
	})
}
