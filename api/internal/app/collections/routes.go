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
	}
}
