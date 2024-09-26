package categories

import (
	"wanderlust/internal/authz"
	"wanderlust/internal/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/categories")
	{
		routes.GET("/", m.handlers.GetCategories)
		routes.POST("/", m.handlers.CreateCategory, middlewares.ParseBody[CreateCategoryRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCategoryCreate))
		routes.DELETE("/:id", m.handlers.DeleteCategory, middlewares.IsAuth, middlewares.Authz(authz.ActCategoryDelete))
		routes.PATCH("/:id", m.handlers.UpdateCategory, middlewares.ParseBody[UpdateCategoryRequestDto], middlewares.IsAuth, middlewares.Authz(authz.ActCategoryUpdate))
	}
}
