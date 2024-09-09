package uploads

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/uploads")
	{
		routes.GET("/new-url", m.handlers.GetNewUrl)
	}
}