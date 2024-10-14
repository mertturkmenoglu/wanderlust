package core

import (
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/search"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"github.com/sony/sonyflake"
)

type AppModule interface {
	RegisterRoutes(e *echo.Group)
}

type Application struct {
	ServerConfiguration ServerConfiguration
	SharedModules       SharedModules
	ApplicationModules  []AppModule
}

type ServerConfiguration struct {
	Port       int
	PortString string
}

type SharedModules struct {
	Config *config.Configuration
	Upload *upload.Upload
	Flake  *sonyflake.Sonyflake
	Db     *db.Db
	Search *search.Search
	Logger *pterm.Logger
	Cache  *cache.Cache
	Email  *email.EmailService
	Tasks  *tasks.Tasks
}
