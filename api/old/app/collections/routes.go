package collections

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/collections")
	{
		routes.GET("/poi/:id", m.handlers.GetCollectionsForPoi)
		routes.GET("/city/:id", m.handlers.GetCollectionsForCity)
		routes.GET("/poi/all", m.handlers.GetAllPoiCollections, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionPoiRelationRead))
		routes.GET("/city/all", m.handlers.GetAllCityCollections, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionCityRelationRead))
	}
}
