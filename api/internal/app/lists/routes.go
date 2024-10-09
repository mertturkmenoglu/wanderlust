package lists

import "github.com/labstack/echo/v4"

func (h *handlers) DummyHandler(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/lists")
	{
		routes.GET("/", m.handlers.DummyHandler) // Get all lists of current user
		routes.GET("/:id", m.handlers.DummyHandler) // Get list by id
		routes.GET("/user/:username", m.handlers.DummyHandler) // Get public lists of user
		routes.POST("/", m.handlers.DummyHandler) // Create list
		routes.PATCH("/:id", m.handlers.DummyHandler) // Update list
		routes.DELETE("/:id", m.handlers.DummyHandler) // Delete list

		routes.POST("/:id/items", m.handlers.DummyHandler) // Create list item
		routes.DELETE("/:id/items/:poiId", m.handlers.DummyHandler) // Delete list item
		routes.PATCH("/:id/items", m.handlers.DummyHandler) // Update list items
	}
}
