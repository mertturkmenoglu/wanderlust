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

func (s *Server) SetupEcho() {
	s.echo.Use(middlewares.CustomRecovery())

	if cfg.Env.Env == "dev" {
		s.echo.Use(otelecho.Middleware("wanderlust", otelecho.WithSkipper(func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		})))

		s.echo.Use(middleware.RequestID())
		s.echo.Use(middlewares.Cors())
		s.echo.Use(middlewares.PTermLogger)
		s.echo.Use(middlewares.CustomBodyDump())
	}

	s.echo.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	s.echo.Use(middleware.Secure())
	s.echo.Use(middleware.BodyLimit("1MB"))

	if cfg.Env.DocsType == "scalar" {
		s.echo.Static("/", "assets")
		s.echo.GET("/docs", func(c echo.Context) error {
			c.Response().Header().Set("Content-Type", "text/html")
			return c.String(http.StatusOK, API_DOCS_SCALAR_HTML)
		})
	}

	s.echo.PUT("/uploads", uploads.Handler)

	s.echo.Static("/uploads", "tmp/storage")
}
