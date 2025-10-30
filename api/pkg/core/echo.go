package core

import (
	"net/http"
	"time"
	"wanderlust/app/uploads"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/middlewares"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
)

func (w *Wanderlust) SetupEcho() {
	w.echo.Use(middlewares.CustomRecovery())

	if cfg.Env.Env == "dev" {
		w.echo.Use(otelecho.Middleware("wanderlust", otelecho.WithSkipper(func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		})))

		w.echo.Use(middleware.RequestID())
		w.echo.Use(middlewares.Cors())
		w.echo.Use(middlewares.PTermLogger)
		w.echo.Use(middlewares.CustomBodyDump())
	}

	w.echo.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	w.echo.Use(middleware.Secure())
	w.echo.Use(middleware.BodyLimit("1MB"))

	if cfg.Env.DocsType == "scalar" {
		w.echo.Static("/", "assets")
		w.echo.GET("/docs", func(c echo.Context) error {
			c.Response().Header().Set("Content-Type", "text/html")
			return c.String(http.StatusOK, API_DOCS_SCALAR_HTML)
		})
	}

	w.echo.PUT("/uploads", uploads.Handler)

	w.echo.Static("/uploads", "tmp/storage")
}
