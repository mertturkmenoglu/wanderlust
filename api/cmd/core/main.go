package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"
	"wanderlust/config"
	"wanderlust/internal/app"
	"wanderlust/internal/db"
	"wanderlust/internal/tracing"
)

func main() {
	config.Bootstrap()

	a := app.New()
	e := a.RegisterRoutes()
	app.InitGlobalMiddlewares(e)

	shouldRunMigrations := os.Getenv("RUN_MIGRATIONS")

	if shouldRunMigrations == "1" {
		db.RunMigrations()
	}

	go a.Tasks.Run()
	defer a.Tasks.Close()

	tracing.InitPrometheus(e)

	// Start the Echo server
	go func() {
		if err := e.Start(a.PortString); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatalf("shutting down the server %v", err.Error())
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
