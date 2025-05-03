package main

import (
	"net/http"
	"time"
	"wanderlust/internal/app/aggregator"
	"wanderlust/internal/app/amenities"
	"wanderlust/internal/app/auth"
	"wanderlust/internal/app/bookmarks"
	"wanderlust/internal/app/categories"
	"wanderlust/internal/app/cities"
	"wanderlust/internal/app/favorites"
	"wanderlust/internal/app/health"
	"wanderlust/internal/app/pois"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/cfg"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/logs"
	"wanderlust/internal/pkg/middlewares"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humaecho"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sony/sonyflake"
)

var (
	API_NAME        = "Wanderlust API"
	API_VERSION     = "2.0.0"
	API_DESCRIPTION = `Welcome to Wanderlust, a travel and location discovery platform designed to inspire exploration and connection. With Wanderlust, you can:<br>
		<ul>
			<li>Explore cities and point of interest (POI) guides, curated with insider tips and recommendations.</li>
			<li>Collect and organize POIs into favorites, bookmarks, and custom lists.</li>
			<li>Follow fellow travelers, send messages, and stay up-to-date on their adventures.</li>
			<li>Record your own trips with diary entries, complete with photos and memories.</li>
			<li>Plan future trips using our intuitive trip planner tool.</li>
			<li>Search and filter results using powerful facets and filters.</li>
		</ul>
		It's open source and free.`
	API_PREFIX           = "/api/v2"
	API_DOCS_SCALAR_HTML = `<!doctype html>
		<html>
		<head>
			<title>API Reference</title>
			<meta charset="utf-8" />
			<meta
			name="viewport"
			content="width=device-width, initial-scale=1" />
		</head>
		<body>
			<script
			id="api-reference"
			data-url="/openapi.json"></script>
			<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
		</body>
		</html>`
)

func main() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

	e := echo.New()
	InitGlobalMiddlewares(e)

	humaConfig := huma.DefaultConfig(API_NAME, API_VERSION)
	humaConfig.Components.SecuritySchemes = map[string]*huma.SecurityScheme{
		"BearerJWT": {
			Type:         "http",
			Scheme:       "bearer",
			BearerFormat: "JWT",
		},
	}
	huma.DefaultArrayNullable = false

	api := humaecho.New(e, humaConfig)
	api.OpenAPI().Info = &huma.Info{
		Title:       API_NAME,
		Description: API_DESCRIPTION,
		Version:     API_VERSION,
	}

	grp := huma.NewGroup(api, API_PREFIX)
	app := NewApplication()

	aggregator.Register(grp, app)
	amenities.Register(grp, app)
	auth.Register(grp, app)
	bookmarks.Register(grp, app)
	categories.Register(grp, app)
	cities.Register(grp, app)
	favorites.Register(grp, app)
	health.Register(grp)
	pois.Register(grp, app)

	if cfg.Get(cfg.RUN_MIGRATIONS) == "1" {
		db.RunMigrations()
	}

	if cfg.Get(cfg.API_DOCS_TYPE) == "scalar" {
		e.GET("/docs", func(c echo.Context) error {
			c.Response().Header().Set("Content-Type", "text/html")
			return c.String(http.StatusOK, API_DOCS_SCALAR_HTML)
		})
	}

	e.Logger.Fatal(e.Start(":5000"))
}

func InitGlobalMiddlewares(e *echo.Echo) {
	e.Use(middleware.Recover())

	if cfg.Get(cfg.ENV) == "dev" {
		e.Use(middleware.RequestID())
		e.Use(middlewares.Cors())
		e.Use(middlewares.PTermLogger)
	}

	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 10 * time.Second,
	}))
	e.Use(middleware.Secure())
	e.Use(middleware.BodyLimit("1MB"))
}

func NewApplication() *core.Application {
	emailSvc := email.New()
	uploadSvc := upload.New()

	return &core.Application{
		Db:     db.NewDb(),
		Flake:  sonyflake.NewSonyflake(sonyflake.Settings{}),
		Logger: logs.NewPTermLogger(),
		Cache:  cache.New(),
		Email:  emailSvc,
		Tasks:  tasks.New(emailSvc, uploadSvc),
		Upload: uploadSvc,
	}
}
