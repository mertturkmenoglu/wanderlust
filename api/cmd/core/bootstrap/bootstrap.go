package bootstrap

import (
	"net/http"
	"time"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/cfg"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/logs"
	"wanderlust/internal/pkg/middlewares"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
)

func LoadEnv() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}
}

func InitGlobalMiddlewares(e *echo.Echo) {
	e.Use(middleware.Recover())

	if cfg.Get(cfg.ENV) == "dev" {
		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
	}

	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	e.Use(middleware.Secure())
	e.Use(middleware.BodyLimit("1MB"))
}

func NewApplication() *core.Application {
	emailSvc := email.New()
	uploadSvc := upload.New()

	return &core.Application{
		Db:     db.NewDb(),
		Flake:  sonyflake.NewSonyflake(sonyflake.Settings{}),
		Logger: logs.NewPTermLogger(),
		Cache:  cache.New(),
		Email:  emailSvc,
		Tasks:  tasks.New(emailSvc, uploadSvc),
		Upload: uploadSvc,
	}
}

func SetupOpenApiSecurityConfig(hc *huma.Config) {
	hc.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		"BearerJWT": {
			Type:         "http",
			Scheme:       "bearer",
			BearerFormat: "JWT",
		},
	}
}

func SetupOpenApiDocs(api *huma.API) {
	(*api).OpenAPI().Info = &huma.Info{
		Title:       API_NAME,
		Description: API_DESCRIPTION,
		Version:     API_VERSION,
	}
}

func RunMigrations() {
	if cfg.Get(cfg.RUN_MIGRATIONS) == "1" {
		db.RunMigrations()
	}
}

func ScalarDocs(e *echo.Echo) {
	if cfg.Get(cfg.API_DOCS_TYPE) == "scalar" {
		e.GET("/docs", func(c echo.Context) error {
			c.Response().Header().Set("Content-Type", "text/html")
			return c.String(http.StatusOK, API_DOCS_SCALAR_HTML)
		})
	}
}

func StartServer(e *echo.Echo) {
	portString := ":" + cfg.Get(cfg.PORT)
	e.Logger.Fatal(e.Start(portString))
}
