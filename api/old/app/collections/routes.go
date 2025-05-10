package collections

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/collections")
	{
		routes.POST("/:id/poi/:poiId", m.handlers.CreateCollectionPoiRelation, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionPoiRelationCreate))
		routes.POST("/:id/city/:cityId", m.handlers.CreateCollectionCityRelation, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionCityRelationCreate))
		routes.DELETE("/:id/poi/:poiId", m.handlers.RemoveCollectionPoiRelation, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionPoiRelationDelete))
		routes.DELETE("/:id/poi/:cityId", m.handlers.RemoveCollectionCityRelation, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionCityRelationDelete))

		routes.GET("/poi/:id", m.handlers.GetCollectionsForPoi)
		routes.GET("/city/:id", m.handlers.GetCollectionsForCity)
		routes.GET("/poi/all", m.handlers.GetAllPoiCollections, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionPoiRelationRead))
		routes.GET("/city/all", m.handlers.GetAllCityCollections, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionCityRelationRead))
	}
}
