package main

import (
	"wanderlust/cmd/core/bootstrap"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/labstack/echo/v4"
)

func main() {
	bootstrap.LoadEnv()

	tracingShutdown := bootstrap.InitTracer()
	defer tracingShutdown()

	e := echo.New()

	humaConfig := huma.DefaultConfig(bootstrap.API_NAME, bootstrap.API_VERSION)

	bootstrap.InitGlobalMiddlewares(e)
	bootstrap.SetupOpenApiSecurityConfig(&humaConfig)

	huma.DefaultArrayNullable = false
	api := humaecho.New(e, humaConfig)

	bootstrap.SetupOpenApiDocs(&api)
	bootstrap.RegisterRoutes(&api)
	bootstrap.RunMigrations()
	bootstrap.ScalarDocs(e)
	bootstrap.StartServer(e)
}
