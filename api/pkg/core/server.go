package core

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/di"
	"wanderlust/pkg/durable"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
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
	app := NewApplication()

	w := Server{
		echo: e,
		app:  app,
		api:  NewHumaApi(e),
	}

	return &w
}

func (s *Server) StartServer() {
	durableSvc := s.app.Get(di.SVC_DURABLE).(*durable.Durable)
	log := s.app.Get(di.SVC_LOG).(*zap.Logger)

	go http.ListenAndServe(":8080", (*durableSvc.Client).Serve())

	tracingShutdown := tracing.Init()
	defer tracingShutdown()

	defer log.Sync()

	s.echo.Logger.Fatal(s.echo.Start(fmt.Sprintf(":%d", cfg.Env.Port)))
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
