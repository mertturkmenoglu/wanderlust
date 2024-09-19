package categories

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/categories")
	{
		routes.GET("/", m.handlers.GetCategories)
	}
}