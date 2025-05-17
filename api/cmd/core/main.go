package main

import (
	"wanderlust/cmd/core/bootstrap"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/labstack/echo/v4"
)

func main() {
	bootstrap.LoadEnv()

	logger := logs.NewZapLogger(tracing.NewOtlpWriter())
	tracingShutdown := bootstrap.InitTracer(logger)

	defer tracingShutdown()

	e := echo.New()

	humaConfig := huma.DefaultConfig(bootstrap.API_NAME, bootstrap.API_VERSION)

	bootstrap.InitGlobalMiddlewares(e, logger)
	bootstrap.SetupOpenApiSecurityConfig(&humaConfig)

	huma.DefaultArrayNullable = false
	api := humaecho.New(e, humaConfig)

	bootstrap.SetupOpenApiDocs(&api)
	bootstrap.RegisterRoutes(&api, logger)
	bootstrap.RunMigrations()
	bootstrap.ScalarDocs(e)
	bootstrap.StartServer(e)
}
