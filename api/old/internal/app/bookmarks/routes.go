package bookmarks

import (
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/bookmarks")
	{
		routes.POST("/", m.handlers.createBookmark, middlewares.ParseBody[CreateBookmarkRequestDto], middlewares.IsAuth)
		routes.DELETE("/:id", m.handlers.deleteBookmarkByPoiId, middlewares.IsAuth)
		routes.GET("/", m.handlers.getUserBookmarks, middlewares.IsAuth)
	}
}
