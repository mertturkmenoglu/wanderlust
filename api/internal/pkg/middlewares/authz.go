package middlewares

import (
	"errors"
	"fmt"
	"net/http"
	"wanderlust/internal/app/api"
	"wanderlust/internal/pkg/authz"

	"github.com/labstack/echo/v4"
)

func Authz(key authz.AuthzAct) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			az := authz.New(getDb())
			fn := authz.Fns[key]
			isAuthorized, err := fn(az, c)

			if err != nil {
				var echoErr *echo.HTTPError

				if errors.As(err, &echoErr) {
					return c.JSON(echoErr.Code, api.ErrorResponse{
						Errors: []api.ErrorDto{
							{
								Status: "0000",
								Code:   fmt.Sprintf("%d", echoErr.Code),
								Title:  echoErr.Message.(string),
								Detail: echoErr.Error(),
							},
						},
					})
				}

				return c.JSON(http.StatusInternalServerError, echo.Map{
					"errors": []echo.Map{
						{
							"status": "0000",
							"code":   "500",
							"title":  fmt.Sprintf("An error happened: %v", err.Error()),
							"detail": fmt.Sprintf("An error happened: %v", err.Error()),
						},
					},
				})
			}

			if !isAuthorized {
				return echo.NewHTTPError(http.StatusForbidden, "unauthorized to perform this action")
			}

			return next(c)
		}
	}
}
