package pois

import (
	"net/http"
	"wanderlust/internal/app/api"
	"wanderlust/internal/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetPoiById(c echo.Context) error {
	userId := c.Get("user_id").(string)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getPoiById(id)

	if err != nil {
		return err
	}

	var isFavorite bool = false
	var isBookmarked bool = false

	if userId != "" {
		isFavorite = h.service.isFavorite(id, userId)
		isBookmarked = h.service.isBookmarked(id, userId)
	}

	return c.JSON(http.StatusOK, api.MetadataResponse{
		Data: res,
		Meta: echo.Map{
			"isFavorite":   isFavorite,
			"isBookmarked": isBookmarked,
		},
	})
}

func (h *handlers) PeekPois(c echo.Context) error {
	res, err := h.service.peekPois()

	if err != nil {
		return err
	}

	v, err := mapPeekPoisToDto(res)

	if err != nil {
		return ErrUnmarshal
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}

func (h *handlers) CreateDraft(c echo.Context) error {
	res, err := h.service.createDraft()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: res,
	})
}

func (h *handlers) GetDrafts(c echo.Context) error {
	res, err := h.service.getDrafts()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}

func (h *handlers) GetDraft(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getDraft(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}

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

	return c.JSON(http.StatusOK, api.Response{
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
