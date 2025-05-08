package reviews

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/reviews")
	{
		routes.GET("/user/:username", m.handlers.getReviewsByUsername)
		routes.GET("/poi/:id", m.handlers.getReviewsByPoiId)
		routes.GET("/poi/:id/ratings", m.handlers.getPoiRatings)
		routes.POST("/:id/media", m.handlers.uploadMedia, middlewares.IsAuth, middlewares.Authz(authz.ActReviewUploadMedia))
	}
}
