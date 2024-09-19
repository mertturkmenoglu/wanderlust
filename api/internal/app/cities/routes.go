package cities

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/cities")
	{
		routes.GET("/", m.handlers.GetCities)
		routes.GET("/featured", m.handlers.GetFeaturedCities)
		routes.GET("/:id", m.handlers.GetCityById)
	}
}
