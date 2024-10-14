package health

import "wanderlust/internal/pkg/core"

type Module struct {
	handlers *handlers
}

var _ core.AppModule = (*Module)(nil)

type handlers struct {
}

func New() *Module {
	handlers := &handlers{}

	return &Module{
		handlers: handlers,
	}
}
