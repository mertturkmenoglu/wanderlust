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

type Server struct {
	app  *Application
	api  *huma.API
	echo *echo.Echo
}

func New() *Server {
	e := echo.New()
	e.HideBanner = true
	huma.DefaultArrayNullable = false

	w := Server{
		echo: e,
		app:  NewApplication(),
		api:  NewHumaApi(e),
	}

	return &w
}

func (s *Server) StartServer() {
	go s.app.Tasks.Run()
	defer s.app.Tasks.Close()

	go s.app.Tasks.RunScheduler()
	s.RegisterPeriodicTasks()

	tracingShutdown := tracing.Init()
	defer tracingShutdown()

	defer s.app.Log.Sync()

	port := fmt.Sprintf(":%d", cfg.Env.Port)
	s.echo.Logger.Fatal(s.echo.Start(port))
}

func (s *Server) StopServer() {
	// Give the server 5 seconds to gracefully shut down, then give up.
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := s.echo.Shutdown(ctx)

	if err != nil {
		log.Fatal(err.Error())
	}
}
