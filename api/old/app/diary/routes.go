package diary

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/diary")
	{
		routes.POST("/", m.handlers.createNewDiaryEntry, middlewares.IsAuth, middlewares.ParseBody[CreateDiaryEntryRequestDto])
		routes.POST("/media/:id", m.handlers.uploadDiaryMedia, middlewares.IsAuth, middlewares.Authz(authz.ActDiaryUploadMedia))
		routes.DELETE("/:id", m.handlers.deleteDiaryEntry, middlewares.IsAuth, middlewares.Authz(authz.ActDiaryDelete))
	}
}
