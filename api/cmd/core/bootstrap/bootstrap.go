package bootstrap

import (
	"encoding/json"
	"net/http"
	"time"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/cfg"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/logs"
	"wanderlust/internal/pkg/middlewares"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
	"go.opentelemetry.io/otel/attribute"
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
		e.Use(otelecho.Middleware("wanderlust", otelecho.WithSkipper(func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		})))

		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
		e.Use(middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {
			sp := utils.NewSpan(c.Request().Context(), "Request and Response Dump")
			defer sp.End()

			paramNames := c.ParamNames()
			params := make(map[string]any, 0)

			for _, paramName := range paramNames {
				params[paramName] = c.Param(paramName)
			}

			paramsBytes, err := json.Marshal(params)

			if err != nil {
				sp.RecordError(err)
			}

			sp.SetAttributes(attribute.String("Request Body", string(reqBody)))
			sp.SetAttributes(attribute.String("Request Params", string(paramsBytes)))
			sp.SetAttributes(attribute.String("Request Query", c.QueryString()))
			sp.SetAttributes(attribute.Int("Response Status", c.Response().Status))
			sp.SetAttributes(attribute.String("Response Body", string(resBody)))
		}))
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
	cacheSvc := cache.New()

	return &core.Application{
		Activities: activities.NewActivity(cacheSvc),
		Db:         db.NewDb(),
		Flake:      sonyflake.NewSonyflake(sonyflake.Settings{}),
		Logger:     logs.NewPTermLogger(),
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
