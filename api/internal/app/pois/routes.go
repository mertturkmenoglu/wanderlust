package pois

import (
	"wanderlust/internal/authz"
	"wanderlust/internal/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/pois")
	{
		routes.GET("/peek", m.handlers.PeekPois)
		routes.GET("/:id", m.handlers.GetPoiById, middlewares.WithAuth)
		routes.POST("/upload-media", m.handlers.UploadMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaUpload))
		routes.POST("/drafts/new", m.handlers.CreateDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftCreate))
		routes.GET("/drafts", m.handlers.GetDrafts, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftCreate))
		routes.GET("/drafts/:id", m.handlers.GetDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftRead))
		routes.DELETE("/drafts/:id", m.handlers.DeleteDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftDelete))
		routes.PATCH("/drafts/:id", m.handlers.UpdateDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftUpdate))
	}
}
