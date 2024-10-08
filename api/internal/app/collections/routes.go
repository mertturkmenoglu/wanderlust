package collections

import (
	"wanderlust/internal/authz"
	"wanderlust/internal/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/collections")
	{
		routes.GET("/", m.handlers.GetCollections, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionRead))
		routes.GET("/:id", m.handlers.GetCollectionById)
		routes.POST("/", m.handlers.CreateCollection, middlewares.ParseBody[CreateCollectionRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCollectionCreate))
		routes.DELETE("/:id", m.handlers.DeleteCollection, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionDelete))
		routes.PATCH("/:id", m.handlers.UpdateCollection, middlewares.ParseBody[UpdateCollectionRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCollectionUpdate))

		routes.GET("/:id/items", m.handlers.GetCollectionItems)
		routes.POST("/:id/items", m.handlers.CreateCollectionItem, middlewares.ParseBody[CreateCollectionItemRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCollectionItemCreate))
		routes.DELETE("/:id/items/:poiId", m.handlers.DeleteCollectionItem, middlewares.IsAuth, middlewares.Authz(authz.ActCollectionItemDelete))
		routes.PATCH("/:id/items", m.handlers.UpdateCollectionItems, middlewares.ParseBody[UpdateCollectionItemsRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCollectionItemUpdate))
	}
}
