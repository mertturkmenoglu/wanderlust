package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"
	"wanderlust/internal/app/aggregator"
	"wanderlust/internal/app/amenities"
	"wanderlust/internal/app/auth"
	"wanderlust/internal/app/bookmarks"
	"wanderlust/internal/app/categories"
	"wanderlust/internal/app/cities"
	"wanderlust/internal/app/collections"
	"wanderlust/internal/app/diary"
	"wanderlust/internal/app/favorites"
	"wanderlust/internal/app/health"
	"wanderlust/internal/app/lists"
	"wanderlust/internal/app/pois"
	"wanderlust/internal/app/reviews"
	"wanderlust/internal/app/users"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/core"
	errorhandler "wanderlust/internal/pkg/core/error_handler"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/logs"
	"wanderlust/internal/pkg/middlewares"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/tracing"
	"wanderlust/internal/pkg/upload"
	"wanderlust/internal/pkg/utils"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
)

func main() {
	_ = config.GetConfiguration()
	app := New()
	e := RegisterRoutes(app)
	InitGlobalMiddlewares(e)

	if os.Getenv("RUN_MIGRATIONS") == "1" {
		db.RunMigrations()
	}

	go app.SharedModules.Tasks.Run()
	defer app.SharedModules.Tasks.Close()

	if os.Getenv("TRACING_ENABLED") == "1" {
		tracing.InitPrometheus(e)
	}

	// Start the Echo server
	go func() {
		if err := e.Start(app.ServerConfiguration.PortString); err != nil && err != http.ErrServerClosed {
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

// New returns a new Application instance.
func New() *core.Application {
	cfg := config.GetConfiguration()
	email := email.New(cfg)
	uploadSvc := upload.New(cfg)
	flake := sonyflake.NewSonyflake(sonyflake.Settings{})
	cacheSvc := cache.New(cfg)
	activities := activities.NewActivity(cacheSvc)

	application := &core.Application{
		ServerConfiguration: core.ServerConfiguration{
			Port:       cfg.GetInt(config.PORT),
			PortString: fmt.Sprintf(":%d", cfg.GetInt(config.PORT)),
		},
		SharedModules: core.SharedModules{
			Config:     cfg,
			Db:         db.NewDb(),
			Flake:      flake,
			Logger:     logs.NewPTermLogger(),
			Cache:      cacheSvc,
			Email:      email,
			Tasks:      tasks.New(cfg, email, uploadSvc),
			Upload:     uploadSvc,
			Activities: activities,
		},
	}

	application.ApplicationModules = []core.AppModule{
		aggregator.New(&application.SharedModules),
		amenities.New(&application.SharedModules),
		auth.New(&application.SharedModules),
		bookmarks.New(&application.SharedModules),
		categories.New(&application.SharedModules),
		cities.New(&application.SharedModules),
		collections.New(&application.SharedModules),
		diary.New(&application.SharedModules),
		favorites.New(&application.SharedModules),
		health.New(),
		lists.New(&application.SharedModules),
		pois.New(&application.SharedModules),
		reviews.New(&application.SharedModules),
		users.New(&application.SharedModules),
	}

	return application
}

// RegisterRoutes registers all the routes for the application.
func RegisterRoutes(app *core.Application) *echo.Echo {
	e := echo.New()
	e.HTTPErrorHandler = errorhandler.CustomHTTPErrorHandler
	api := e.Group("/api")

	api.Use(middlewares.GetSessionMiddleware(app.SharedModules.Config))

	for _, module := range app.ApplicationModules {
		module.RegisterRoutes(api)
	}

	return e
}

func InitGlobalMiddlewares(e *echo.Echo) {
	e.Validator = &utils.CustomValidator{
		Validator: validator.New(),
	}

	e.Use(middleware.Recover())
	cfg := config.GetConfiguration()

	if cfg.GetString(config.ENV) == "dev" {
		e.IPExtractor = echo.ExtractIPDirect()
		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
	}

	e.Use(middlewares.ZapLogger())
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	e.Use(middleware.Secure())
	e.Use(middleware.BodyLimit("2MB"))
}
