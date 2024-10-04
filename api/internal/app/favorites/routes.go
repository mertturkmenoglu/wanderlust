package favorites

import (
	"wanderlust/internal/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/favorites")
	{
		routes.POST("/", m.handlers.createFavorite, middlewares.ParseBody[CreateFavoriteRequestDto], middlewares.IsAuth)
		routes.DELETE("/:id", m.handlers.deleteFavoriteByPoiId, middlewares.IsAuth)
		routes.GET("/", m.handlers.getUserFavorites, middlewares.IsAuth)
		routes.GET("/:username", m.handlers.getUserFavoritesByUsername)
	}
}
