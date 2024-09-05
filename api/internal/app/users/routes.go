package users

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/users")
	{
		routes.GET("/:username", m.handlers.GetUserProfile)
	}
}
