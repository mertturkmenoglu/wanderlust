package main

import (
	"wanderlust/cmd/core/bootstrap"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/labstack/echo/v4"
)

func main() {
	bootstrap.LoadEnv()

	e := echo.New()
	e.HideBanner = true
	huma.DefaultArrayNullable = false
	app := bootstrap.NewApplication()
	humaConfig := bootstrap.GetHumaConfig()
	api := humaecho.New(e, *humaConfig)

	bootstrap.InitGlobalMiddlewares(e, app)
	bootstrap.SetupOpenApiDocs(&api)
	bootstrap.RegisterRoutes(app, &api)
	bootstrap.RunMigrations()
	bootstrap.ScalarDocs(e)
	bootstrap.StartServer(app, e)
}
