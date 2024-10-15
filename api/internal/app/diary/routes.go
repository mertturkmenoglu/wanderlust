package diary

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/diary")
	{
		routes.GET("/", m.handlers.getDiary)
	}
}
