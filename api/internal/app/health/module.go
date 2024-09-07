package health

import "wanderlust/internal/app/api"

type Module struct {
	handlers *handlers
}

var _ api.IModule = (*Module)(nil)

type handlers struct {
}

func New() *Module {
	handlers := &handlers{}

	return &Module{
		handlers: handlers,
	}
}
