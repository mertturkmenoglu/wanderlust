package pois

import (
	"sync"
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
	repository *Repository
	draftMutex sync.Mutex
	di         *core.SharedModules
}

type Repository struct {
	DI *core.SharedModules
}

func New(di *core.SharedModules) *Module {
	repository := Repository{
		DI: di,
	}

	service := service{
		repository: &repository,
		di:         di,
	}

	handlers := handlers{
		service: &service,
		di:      di,
	}

	return &Module{
		handlers: &handlers,
	}
}
