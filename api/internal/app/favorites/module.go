package favorites

import (
	"wanderlust/internal/app/api"
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
}

type repository struct {
	db *db.Db
}

func New(db *db.Db) *Module {
	repository := &repository{
		db: db,
	}

	service := &service{
		repository: repository,
	}

	handlers := &handlers{
		service: service,
	}

	return &Module{
		handlers: handlers,
	}
}
