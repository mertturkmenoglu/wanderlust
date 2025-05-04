package users

import (
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/users")
	{
		routes.POST("/:username/make-verified", m.handlers.MakeUserVerified)
		routes.PATCH("/profile", m.handlers.UpdateUserProfile, middlewares.ParseBody[UpdateUserProfileRequestDto], middlewares.IsAuth)
		routes.POST("/follow/:username", m.handlers.FollowUser, middlewares.IsAuth)
	}
}
