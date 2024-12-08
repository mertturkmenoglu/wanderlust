package cities

import (
	"wanderlust/internal/pkg/authz"
	mw "wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	h := m.handlers
	r := e.Group("/cities")
	{
		r.GET("/", h.List)
		r.GET("/featured", h.Featured)
		r.GET("/:id", h.Get)
		r.POST("/", h.Create, mw.ParseBody[CreateReqDto], mw.IsAuth, mw.Authorize(authz.IsAdmin))
		r.DELETE("/:id", h.Remove, mw.IsAuth, mw.Authorize(authz.IsAdmin))
		r.PATCH("/:id", h.Update, mw.ParseBody[UpdateReqDto], mw.IsAuth, mw.Authorize(authz.IsAdmin))
	}
}
