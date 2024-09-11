package pois

import (
	"wanderlust/internal/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/pois")
	{
		routes.GET("/:id", m.handlers.GetPoiById, middlewares.WithAuth)
	}
}
