package middlewares

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func CustomBodyDump(logger *zap.Logger) echo.MiddlewareFunc {
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

			logger.Info("Request",
				zap.String("http.method", method),
				zap.String("http.url", uri),
				zap.Int("http.status_code", status),
				zap.String("http.request_body", string(reqBody)),
				zap.String("http.response_body", string(resBody)),
				zap.String("http.query_params", qp),
				zap.Object("http.path_params", zapcore.ObjectMarshalerFunc(func(oe zapcore.ObjectEncoder) error {
					for _, p := range c.ParamNames() {
						oe.AddString(p, c.Param(p))
					}
					return nil
				})),
			)
		},
	})
}
