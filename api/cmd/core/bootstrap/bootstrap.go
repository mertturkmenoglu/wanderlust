package bootstrap

import (
	"fmt"
	"net/http"
	"time"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/email"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
	"go.uber.org/zap"
)

func LoadEnv() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

	cfg.InitConfigurationStruct()
}

func InitGlobalMiddlewares(e *echo.Echo, logger *zap.Logger) {
	e.Use(middlewares.CustomRecovery())

	if cfg.Env.Env == "dev" {
		e.Use(otelecho.Middleware("wanderlust", otelecho.WithSkipper(func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		})))

		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
		e.Use(middlewares.CustomBodyDump(logger))
	}

	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	e.Use(middleware.Secure())
	e.Use(middleware.BodyLimit("1MB"))
}

func NewApplication(logger *zap.Logger) *core.Application {
	emailSvc := email.New()
	uploadSvc := upload.New()
	cacheSvc := cache.New()

	return &core.Application{
		Activities: activities.NewActivity(cacheSvc),
		Db:         db.NewDb(),
		Flake:      sonyflake.NewSonyflake(sonyflake.Settings{}),
		Log:        logger,
		Cache:      cacheSvc,
		Email:      emailSvc,
		Tasks:      tasks.New(emailSvc, uploadSvc),
		Upload:     uploadSvc,
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
	if cfg.Env.RunMigrations == "1" {
		db.RunMigrations()
	}
}

func ScalarDocs(e *echo.Echo) {
	if cfg.Env.DocsType == "scalar" {
		e.Static("/", "assets")
		e.GET("/docs", func(c echo.Context) error {
			c.Response().Header().Set("Content-Type", "text/html")
			return c.String(http.StatusOK, API_DOCS_SCALAR_HTML)
		})
	}
}

func StartServer(e *echo.Echo) {
	portString := fmt.Sprintf(":%d", cfg.Env.Port)
	e.Logger.Fatal(e.Start(portString))
}

func InitTracer() func() {
	return tracing.Init()
}
