package api

import (
	"wanderlust/config"
	"wanderlust/internal/pkg/logs"

	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
)

var logger = logs.NewPTermLogger()

func CustomHTTPErrorHandler(err error, c echo.Context) {
	if c.Response().Committed {
		return
	}

	if viper.GetString(config.ENV) == "dev" {
		logger.Error("An error happened:", logger.Args("method", c.Request().Method, "path", c.Path(), "error", err.Error()))
	}

	_, isEchoErr := err.(*echo.HTTPError)

	if !isEchoErr {
		ae, ok := err.(ApiError)

		if ok {
			NewErr(c, ae.Status, ae)
			return
		}
	}

	c.Echo().DefaultHTTPErrorHandler(err, c)
}
