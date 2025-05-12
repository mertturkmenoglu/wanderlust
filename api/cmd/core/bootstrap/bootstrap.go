package bootstrap

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/email"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
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

func InitTracer() func() {
	exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(cfg.Get(cfg.JAEGER_ENDPOINT))))

	if err != nil {
		log.Fatal(err)
	}

	tp := trace.NewTracerProvider(
		trace.WithBatcher(exp),
		trace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName("wanderlust"),
		)),
	)

	otel.SetTracerProvider(tp)

	return func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Fatal(err)
		}
	}
}
