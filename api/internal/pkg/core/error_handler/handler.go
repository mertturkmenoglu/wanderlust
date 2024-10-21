package errorhandler

import (
	"wanderlust/internal/pkg/config"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/logs"

	"github.com/labstack/echo/v4"
)

var (
	logger = logs.NewPTermLogger()
	cfg    = config.GetConfiguration()
)

func CustomHTTPErrorHandler(err error, c echo.Context) {
	if c.Response().Committed {
		return
	}

	if cfg.GetString(config.ENV) == "dev" {
		logger.Error("An error happened:", logger.Args("method", c.Request().Method, "path", c.Path(), "error", err.Error()))
	}

	_, isEchoErr := err.(*echo.HTTPError)

	if !isEchoErr {
		ae, ok := err.(errs.ApiError)

		if ok {
			errs.NewErr(c, ae.Status, ae)
			return
		}
	}

	c.Echo().DefaultHTTPErrorHandler(err, c)
}
