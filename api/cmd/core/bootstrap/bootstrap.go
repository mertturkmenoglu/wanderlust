package bootstrap

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/email"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/random"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	slogecho "github.com/samber/slog-echo"
	"github.com/sony/sonyflake"
	"go.opentelemetry.io/contrib/instrumentation/github.com/labstack/echo/otelecho"
	"go.opentelemetry.io/otel"
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

	cfg.InitConfigurationStruct()
}

func InitGlobalMiddlewares(e *echo.Echo) {
	e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
		LogErrorFunc: func(c echo.Context, err error, stack []byte) error {
			f, _ := os.Create("tmp/" + random.FromLetters(16) + ".log")
			defer f.Close()

			f.Write([]byte(err.Error()))
			f.Write(stack)
			log.Println(err)

			return err
		},
	}))

	if cfg.Env.Env == "dev" {
		logFile, err := os.OpenFile("tmp/application.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

		if err != nil {
			log.Fatal(err)
		}

		e.Use(otelecho.Middleware("wanderlust", otelecho.WithSkipper(func(c echo.Context) bool {
			return c.Request().Method == http.MethodOptions
		})))

		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
		e.Use(slogecho.NewWithConfig(slog.New(slog.NewJSONHandler(logFile, nil)), slogecho.Config{
			WithSpanID:         true,
			WithTraceID:        true,
			WithRequestID:      true,
			WithRequestBody:    true,
			WithRequestHeader:  true,
			WithUserAgent:      true,
			WithResponseBody:   true,
			WithResponseHeader: true,
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
	exp, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(cfg.Env.JaegerEndpoint)))

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
