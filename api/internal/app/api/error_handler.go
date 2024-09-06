package api

import (
	"fmt"
	"net/http"
	"wanderlust/config"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"github.com/spf13/viper"
)

func CustomHTTPErrorHandler(err error, c echo.Context) {
	pterm.DefaultLogger.WithLevel(pterm.LogLevelError).Error(err.Error())

	code := http.StatusInternalServerError
	ae, ok := err.(ApiError)
	env := viper.GetString(config.ENV)
	isDev := env == "dev"
	shouldLog := !(!isDev && ae.Status >= http.StatusInternalServerError)

	if ok && shouldLog {
		code = ae.Status

		c.JSON(code, ErrorResponse{
			Errors: []ErrorDto{
				{
					Status: fmt.Sprintf("%d", code),
					Code:   ae.Code,
					Title:  ae.Err.Error(),
					Detail: ae.Err.Error(),
				},
			},
		})
	} else {
		c.JSON(ae.Status, echo.Map{
			"message": http.StatusText(ae.Status),
		})
	}
}
