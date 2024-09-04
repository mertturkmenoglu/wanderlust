package health

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/health")
	{
		routes.GET("/", m.handlers.getHealth)
	}
}
