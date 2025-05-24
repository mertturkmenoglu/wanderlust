package middlewares

import (
	"fmt"
	"log/slog"
	"net/http"
	"wanderlust/pkg/tracing"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func CustomBodyDump() echo.MiddlewareFunc {
	return middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{
		Skipper: func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		},
		Handler: func(c echo.Context, reqBody []byte, resBody []byte) {
			req := c.Request()
			res := c.Response()
			method := req.Method
			uri := req.RequestURI
			status := res.Status
			qp := c.QueryParams().Encode()

			pp := make([]string, 0)

			for _, p := range c.ParamNames() {
				pp = append(pp, fmt.Sprintf("%s=%s", p, c.Param(p)))
			}

			msg := method + " " + uri

			tracing.Slog.LogAttrs(
				c.Request().Context(),
				slog.LevelDebug,
				msg,
				slog.String("http.method", method),
				slog.String("http.url", uri),
				slog.Int("http.status_code", status),
				slog.String("http.request_body", string(reqBody)),
				slog.String("http.response_body", string(resBody)),
				slog.String("http.query_params", qp),
				slog.Any("http.path_params", pp),
			)
		},
	})
}
