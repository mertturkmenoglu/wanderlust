package bootstrap

import (
	"fmt"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/core"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/labstack/echo/v4"
)

type Wanderlust struct {
	app  *core.Application
	api  *huma.API
	echo *echo.Echo
}

func New() *Wanderlust {
	e := echo.New()
	e.HideBanner = true
	huma.DefaultArrayNullable = false

	w := Wanderlust{
		echo: e,
		app:  NewApp(),
		api:  NewHumaApi(e),
	}

	return &w
}

func (w *Wanderlust) StartServer() {
	go w.app.Tasks.Run()
	defer w.app.Tasks.Close()

	tracingShutdown := tracing.Init()
	defer tracingShutdown()

	defer w.app.Log.Sync()

	portString := fmt.Sprintf(":%d", cfg.Env.Port)
	w.echo.Logger.Fatal(w.echo.Start(portString))
}
