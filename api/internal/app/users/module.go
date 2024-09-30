package users

import (
	"wanderlust/internal/app/api"
	"wanderlust/internal/cache"
	"wanderlust/internal/db"
	"wanderlust/internal/upload"

	"github.com/pterm/pterm"
)

type Module struct {
	handlers *handlers
}

var _ api.IModule = (*Module)(nil)

type handlers struct {
	service *service
	logger  *pterm.Logger
	cache   *cache.Cache
}

type service struct {
	repository   *repository
	uploadClient *upload.Upload
}

type repository struct {
	db *db.Db
}

func New(db *db.Db, logger *pterm.Logger, cache *cache.Cache, upload *upload.Upload) *Module {
	repository := repository{
		db: db,
	}

	service := service{
		repository:   &repository,
		uploadClient: upload,
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
