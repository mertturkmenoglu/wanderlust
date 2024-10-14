package lists

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/lists")
	{
		routes.GET("/", m.handlers.getAllListsOfUser, middlewares.IsAuth)
		routes.GET("/:id", m.handlers.getListById, middlewares.WithAuth, middlewares.Authz(authz.ActListRead))
		routes.GET("/status/:poiId", m.handlers.getListStatus, middlewares.IsAuth, middlewares.Authz(authz.ActListStatus))
		routes.GET("/user/:username", m.handlers.getPublicListsOfUser)
		routes.POST("/", m.handlers.createList, middlewares.ParseBody[CreateListRequestDto], middlewares.IsAuth)
		routes.PATCH("/:id", m.handlers.updateList)
		routes.DELETE("/:id", m.handlers.deleteList, middlewares.IsAuth, middlewares.Authz(authz.ActListDelete))

		routes.POST("/:id/items", m.handlers.createListItem, middlewares.ParseBody[CreateListItemRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActListItemCreate))
		routes.DELETE("/:id/items/:poiId", m.handlers.deleteListItem)
		routes.PATCH("/:id/items", m.handlers.updateListItems)
	}
}
