package aggregator

import "github.com/labstack/echo/v4"

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/aggregator")
	{
		routes.GET("/home", m.handlers.HomeAggregation)
	}
}
