package pois

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) DeleteDraft(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.deleteDraft(id)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateDraft(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	var body map[string]any

	if err := c.Bind(&body); err != nil {
		return echo.ErrBadRequest
	}

	err := h.service.updateDraft(id, body)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UploadMedia(c echo.Context) error {
	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = h.service.validateMediaUpload(mpf)

	if err != nil {
		return err
	}

	res, err := h.service.uploadMedia(mpf)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) DeleteMedia(c echo.Context) error {
	name := c.QueryParam("name")
	draftId := c.QueryParam("draftId")

	if name == "" || draftId == "" {
		return ErrIdRequired
	}

	err := h.service.deleteMedia(draftId, name)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

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
