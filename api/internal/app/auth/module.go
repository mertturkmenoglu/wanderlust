package auth

import (
	"wanderlust/internal/cache"
	"wanderlust/internal/db"
	"wanderlust/internal/tasks"

	"github.com/pterm/pterm"
	"github.com/sony/sonyflake"
)

type Module struct {
	handlers *handlers
}

type handlers struct {
	service *service
	logger  *pterm.Logger
	flake   *sonyflake.Sonyflake
	cache   *cache.Cache
	tasks   *tasks.Tasks
}

type service struct {
	repository *repository
}

type repository struct {
	db    *db.Db
	flake *sonyflake.Sonyflake
}

func New(db *db.Db, logger *pterm.Logger, flake *sonyflake.Sonyflake, cache *cache.Cache, tasks *tasks.Tasks) *Module {
	repository := repository{
		db:    db,
		flake: flake,
	}

	service := service{
		repository: &repository,
	}

	handlers := handlers{
		service: &service,
		logger:  logger,
		flake:   flake,
		cache:   cache,
		tasks:   tasks,
	}

	return &Module{
		handlers: &handlers,
	}
}
