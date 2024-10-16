package amenities

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/amenities")
	{
		routes.GET("/", m.handlers.GetAmenities)
		routes.PATCH("/:id", m.handlers.UpdateAmenity, middlewares.ParseBody[UpdateAmenityRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActAmenityUpdate))
		routes.POST("/", m.handlers.CreateAmenity, middlewares.ParseBody[CreateAmenityRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActAmenityCreate))
		routes.DELETE("/:id", m.handlers.DeleteAmenity, middlewares.IsAuth, middlewares.Authz(authz.ActAmenityDelete))
	}
}
