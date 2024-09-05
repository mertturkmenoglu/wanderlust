package users

import (
	"wanderlust/internal/cache"
	"wanderlust/internal/db"

	"github.com/pterm/pterm"
)

type Module struct {
	handlers *handlers
}

type handlers struct {
	service *service
	logger  *pterm.Logger
	cache   *cache.Cache
}

type service struct {
	repository *repository
}

type repository struct {
	db *db.Db
}

func New(db *db.Db, logger *pterm.Logger, cache *cache.Cache) *Module {
	repository := repository{
		db: db,
	}

	service := service{
		repository: &repository,
	}

	handlers := handlers{
		service: &service,
		logger:  logger,
		cache:   cache,
	}

	return &Module{
		handlers: &handlers,
	}
}
