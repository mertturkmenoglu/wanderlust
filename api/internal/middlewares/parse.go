package middlewares

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ParseBody[T any](next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var body T

		if err := c.Bind(&body); err != nil {
			return echo.ErrBadRequest
		}

		if err := c.Validate(&body); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		c.Set("body", body)
		return next(c)
	}
}
