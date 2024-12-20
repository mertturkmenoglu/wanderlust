package diary

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) listDiaryEntries(c echo.Context) error {
	userId := c.Get("user_id").(string)
	params, err := getPaginationParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.listDiaryEntries(userId, params)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params.Params, count),
	})
}

func (h *handlers) createNewDiaryEntry(c echo.Context) error {
	userId := c.Get("user_id").(string)
	dto := c.Get("body").(CreateDiaryEntryRequestDto)

	res, err := h.service.createNewDiaryEntry(userId, dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) uploadDiaryMedia(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = h.service.validateMediaMPF(mpf)

	if err != nil {
		return err
	}

	res, err := h.service.uploadMedia(id, mpf)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: echo.Map{
			"url": res,
		},
	})
}

func (h *handlers) getDiaryEntryById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getDiaryEntryById(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) changeSharing(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.changeSharing(id)

	if err != nil {
		return err
	}

	_ = h.service.invalidateDiaryEntryCache(id)

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) deleteDiaryEntry(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.deleteDiaryEntry(id)

	if err != nil {
		return err
	}

	_ = h.service.invalidateDiaryEntryCache(id)

	return c.NoContent(http.StatusNoContent)
}
