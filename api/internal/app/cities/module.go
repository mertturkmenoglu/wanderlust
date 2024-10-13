package cities

import (
	"wanderlust/internal/app/api"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/db"
)

type Module struct {
	handlers *handlers
}

var _ api.IModule = (*Module)(nil)

type handlers struct {
	service *service
}

type service struct {
	repository *repository
	cache      *cache.Cache
}

type repository struct {
	db *db.Db
}

func New(db *db.Db, cache *cache.Cache) *Module {
	repository := repository{
		db: db,
	}

	service := service{
		repository: &repository,
		cache:      cache,
	}

	handlers := &handlers{
		service: &service,
	}

	return &Module{
		handlers: handlers,
	}
}
