package pois

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)


func (h *handlers) PublishDraft(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.publishDraft(id)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusCreated)
}
