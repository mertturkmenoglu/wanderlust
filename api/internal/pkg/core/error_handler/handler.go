package errorhandler

import (
	"fmt"
	"net/http"
	"wanderlust/internal/pkg/config"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/logs"

	"github.com/go-playground/validator/v10"
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

	validationErrors, ok := err.(validator.ValidationErrors)

	if ok {
		errDtos := make([]errs.ErrorDto, 0)

		for _, valErr := range validationErrors {
			errDtos = append(errDtos, errs.ErrorDto{
				Status: fmt.Sprintf("%d", http.StatusBadRequest),
				Code:   "0000",
				Title:  "Error validating: " + valErr.Field(),
				Detail: valErr.Error(),
			})
		}

		errs.NewErrs(c, http.StatusBadRequest, errDtos)
		return
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
