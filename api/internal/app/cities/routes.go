package cities

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/cities")
	{
		routes.GET("/", m.handlers.GetCities)
		routes.GET("/featured", m.handlers.GetFeaturedCities)
		routes.GET("/:id", m.handlers.GetCityById)
		routes.POST("/", m.handlers.CreateCity, middlewares.ParseBody[CreateCityRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCityCreate))
		routes.DELETE("/:id", m.handlers.DeleteCity, middlewares.IsAuth, middlewares.Authz(authz.ActCityDelete))
		routes.PATCH("/:id", m.handlers.UpdateCity, middlewares.ParseBody[UpdateCityRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCityUpdate))
	}
}
