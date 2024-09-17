package cities

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/cities")
	{
		routes.GET("/:id", m.handlers.GetCityById)
	}
}
