package middlewares

import (
	"errors"
	"net/http"
	"wanderlust/internal/authz"

	"github.com/labstack/echo/v4"
)

func Authz(key authz.AuthzAct) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			az := authz.New(getDb())
			fn := authz.Fns[key]
			isAuthorized, err := fn(az, c)

			if err != nil {
				var status int = http.StatusInternalServerError

				if errors.Is(err, echo.ErrNotFound) {
					status = http.StatusNotFound
				} else if errors.Is(err, echo.ErrForbidden) {
					status = http.StatusForbidden
				} else {
					status = http.StatusInternalServerError
				}

				statusText := http.StatusText(status)

				return c.JSON(status, echo.Map{
					"message": statusText,
				})
			}

			if !isAuthorized {
				return echo.NewHTTPError(http.StatusForbidden, "unauthorized to perform this action")
			}

			return next(c)
		}
	}
}
