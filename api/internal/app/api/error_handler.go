package api

import (
	"github.com/labstack/echo/v4"
)

func CustomHTTPErrorHandler(err error, c echo.Context) {
	if c.Response().Committed {
		return
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
