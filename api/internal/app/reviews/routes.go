package reviews

import (
	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/reviews")
	{
		routes.GET("/", m.handlers.getReviewById)
	}
}
