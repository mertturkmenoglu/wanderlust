package pois

import (
	"sync"
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
	repository   *Repository
	uploadClient *upload.Upload
	draftMutex   sync.Mutex
	cache        *cache.Cache
}

type Repository struct {
	Db    *db.Db
	Flake *sonyflake.Sonyflake
}

func New(db *db.Db, flake *sonyflake.Sonyflake, upload *upload.Upload, cache *cache.Cache) *Module {
	repository := Repository{
		Db:    db,
		Flake: flake,
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
