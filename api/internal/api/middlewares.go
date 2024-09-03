package api

import (
	"time"
	"wanderlust/config"
	"wanderlust/internal/middlewares"
	"wanderlust/internal/validation"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/spf13/viper"
)

func InitGlobalMiddlewares(e *echo.Echo) {
	e.Validator = &validation.CustomValidator{
		Validator: validator.New(),
	}

	e.Use(middleware.Recover())

	if viper.GetString(config.ENV) == "dev" {
		e.IPExtractor = echo.ExtractIPDirect()
		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
	}

	e.Use(middlewares.ZapLogger())
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	e.Use(middleware.Secure())
	e.Use(middleware.BodyLimit("2MB"))
}
