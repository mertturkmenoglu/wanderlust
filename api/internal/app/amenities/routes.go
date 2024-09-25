package amenities

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/amenities")
	{
		routes.GET("/", m.handlers.GetAmenities)
	}
}
