package uploads

import "wanderlust/internal/upload"

type Module struct {
	handlers *handlers
}

type handlers struct {
	service *service
}

type service struct {
	upload *upload.Upload
}

func New(upload *upload.Upload) *Module {
	service := service{
		upload: upload,
	}

	handlers := &handlers{
		service: &service,
	}

	return &Module{
		handlers: handlers,
	}
}
