package app

import (
	"fmt"
	"wanderlust/config"
	"wanderlust/internal/app/api"
	"wanderlust/internal/app/auth"
	"wanderlust/internal/app/health"
	"wanderlust/internal/app/users"
	"wanderlust/internal/cache"
	"wanderlust/internal/db"
	"wanderlust/internal/email"
	"wanderlust/internal/logs"
	"wanderlust/internal/middlewares"
	"wanderlust/internal/search"
	"wanderlust/internal/tasks"
	"wanderlust/internal/upload"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"github.com/sony/sonyflake"
	"github.com/spf13/viper"
	"go.uber.org/zap"
)

// Application struct is the main definition of all the different dependencies
// that are needed to run the application.
type Application struct {
	Port       int
	PortString string
	Upload     *upload.Upload
	ZapLogger  *zap.Logger
	Flake      *sonyflake.Sonyflake
	Db         *db.Db
	Search     *search.Search
	Logger     *pterm.Logger
	Cache      *cache.Cache
	Email      *email.EmailService
	Tasks      *tasks.Tasks
}

// New returns a new Service instance.
func New() *Application {
	apiObj := &Application{
		Upload:     upload.New(),
		Flake:      nil,
		ZapLogger:  logs.New(),
		Port:       viper.GetInt(config.PORT),
		PortString: fmt.Sprintf(":%d", viper.GetInt(config.PORT)),
		Db:         db.NewDb(),
		Search:     search.New(),
		Logger:     logs.NewPTermLogger(),
		Cache:      cache.New(),
		Email:      email.New(),
		Tasks:      nil,
	}

	flake, err := sonyflake.New(sonyflake.Settings{})

	if err != nil {
		panic(err.Error())
	}

	apiObj.Flake = flake
	apiObj.Tasks = tasks.New(apiObj.Email)

	return apiObj
}

// RegisterRoutes registers all the routes for the application.
func (s *Application) RegisterRoutes() *echo.Echo {
	e := echo.New()

	e.HTTPErrorHandler = api.CustomHTTPErrorHandler

	modules := []api.IModule{
		health.New(),
		auth.New(s.Db, s.Logger, s.Flake, s.Cache, s.Tasks),
		users.New(s.Db, s.Logger, s.Cache),
	}

	api := e.Group("/api")

	api.Use(middlewares.GetSessionMiddleware())

	for _, module := range modules {
		module.RegisterRoutes(api)
	}

	return e
}
