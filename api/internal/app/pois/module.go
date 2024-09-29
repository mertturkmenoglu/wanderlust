package pois

import (
	"wanderlust/internal/app/api"
	"wanderlust/internal/cache"
	"wanderlust/internal/db"
	"wanderlust/internal/upload"

	"github.com/sony/sonyflake"
)

type Module struct {
	handlers *handlers
}

var _ api.IModule = (*Module)(nil)

type handlers struct {
	service *service
}

type service struct {
	repository   *repository
	uploadClient *upload.Upload
	cache        *cache.Cache
}

type repository struct {
	db    *db.Db
	flake *sonyflake.Sonyflake
}

func New(db *db.Db, flake *sonyflake.Sonyflake, upload *upload.Upload, cache *cache.Cache) *Module {
	repository := repository{
		db:    db,
		flake: flake,
	}

	service := service{
		repository:   &repository,
		uploadClient: upload,
		cache:        cache,
	}

	handlers := handlers{
		service: &service,
	}

	return &Module{
		handlers: &handlers,
	}
}
