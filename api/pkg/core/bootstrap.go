package core

import (
	"context"
	"fmt"
	"log"
	"time"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/labstack/echo/v4"
)

type Wanderlust struct {
	app  *Application
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

	go w.app.Tasks.RunScheduler()
	w.RegisterPeriodicTasks()

	tracingShutdown := tracing.Init()
	defer tracingShutdown()

	defer w.app.Log.Sync()

	port := fmt.Sprintf(":%d", cfg.Env.Port)
	w.echo.Logger.Fatal(w.echo.Start(port))
}

func (w *Wanderlust) StopServer() {
	// Give the server 5 seconds to gracefully shut down, then give up.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := w.echo.Shutdown(ctx)

	if err != nil {
		log.Fatal(err.Error())
	}
}
