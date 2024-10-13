package lists

import (
	"wanderlust/internal/app/api"
	"wanderlust/internal/pkg/db"

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
	repository *repository
}

type repository struct {
	db    *db.Db
	flake *sonyflake.Sonyflake
}

func New(db *db.Db, flake *sonyflake.Sonyflake) *Module {
	repository := &repository{
		db:    db,
		flake: flake,
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
