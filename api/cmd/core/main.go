package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"wanderlust/config"
	"wanderlust/internal/api"
	"wanderlust/internal/db"

	"github.com/labstack/echo-contrib/echoprometheus"
	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/prometheus"

	"github.com/MarceloPetrucio/go-scalar-api-reference"
	echoSwagger "github.com/swaggo/echo-swagger"

	_ "wanderlust/swaggerdocs"
)

// @title			Wanderlust API
// @version		1.0
// @description	Wanderlust backend services
// @termsOfService	http://localhost:3000/terms
// @contact.name	Mert Turkmenoglu
// @contact.url	https://mertturkmenoglu.com
// @contact.email	getwanderlust@gmail.com
// @license.name	MIT
// @license.url	https://mit-license.org/
// @host			localhost:5000
// @BasePath		/api
// @securityDefinitions.apikey	CookieAuth
// @in							cookie
// @name						__wanderlust_auth
// @description			Cookie based session authentication
func main() {
	config.Bootstrap()

	a := api.New()
	e := a.RegisterRoutes()

	e.GET("/swagger/*", echoSwagger.WrapHandler)
	e.GET("/scalar", func(c echo.Context) error {
		htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
			SpecURL: "./swaggerdocs/swagger.json",
			CustomOptions: scalar.CustomOptions{
				PageTitle: "Scalar Docs",
			},
			DarkMode: true,
		})

		if err != nil {
			fmt.Println(err)
			return err
		}

		return c.HTML(http.StatusOK, htmlContent)
	})

	api.InitGlobalMiddlewares(e)

	shouldRunMigrations := os.Getenv("RUN_MIGRATIONS")

	if shouldRunMigrations == "1" {
		db.RunMigrations()
	}

	go a.Tasks.Run()
	defer a.Tasks.Close()

	// create new counter metric. This is replacement for `prometheus.Metric` struct
	customCounter := prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "custom_requests_total",
			Help: "How many HTTP requests processed, partitioned by status code and HTTP method.",
		},
	)

	// register your new counter metric with default metrics registry
	if err := prometheus.Register(customCounter); err != nil {
		log.Fatal(err)
	}

	e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
		AfterNext: func(c echo.Context, err error) {
			customCounter.Inc() // use our custom metric in middleware. after every request increment the counter
		},
	}))

	// e.Use(echoprometheus.NewMiddleware("wanderlust")) // adds middleware to gather metrics
	e.GET("/metrics", echoprometheus.NewHandler()) // adds route to serve gathered metrics

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
