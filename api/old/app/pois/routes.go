package pois

import (
	"wanderlust/internal/pkg/authz"
	"wanderlust/internal/pkg/middlewares"

	"github.com/labstack/echo/v4"
)

func (m *Module) RegisterRoutes(e *echo.Group) {
	routes := e.Group("/pois")
	{
		routes.POST("/media", m.handlers.UploadMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaUpload))
		routes.DELETE("/media", m.handlers.DeleteMedia, middlewares.IsAuth, middlewares.Authz(authz.ActPoiMediaDelete))
		routes.DELETE("/drafts/:id", m.handlers.DeleteDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftDelete))
		routes.POST("/drafts/:id/publish", m.handlers.PublishDraft, middlewares.IsAuth, middlewares.Authz(authz.ActPoiDraftPublish))
	}
}
