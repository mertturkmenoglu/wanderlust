package health

type Module struct {
	handlers *handlers
}

type handlers struct {
}

func New() *Module {
	handlers := &handlers{}

	return &Module{
		handlers: handlers,
	}
}
