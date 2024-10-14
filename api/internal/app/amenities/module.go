package amenities

import (
	"wanderlust/internal/pkg/core"
)

type Module struct {
	handlers *handlers
}

var _ core.AppModule = (*Module)(nil)

type handlers struct {
	service *service
	di      *core.SharedModules
}

type service struct {
	repository *repository
	di         *core.SharedModules
}

type repository struct {
	di *core.SharedModules
}

func New(di *core.SharedModules) *Module {
	repository := &repository{
		di: di,
	}

	service := &service{
		repository: repository,
		di:         di,
	}

	handlers := &handlers{
		service: service,
		di:      di,
	}

	return &Module{
		handlers: handlers,
	}
}
