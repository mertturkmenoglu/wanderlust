package reviews

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) getReviewById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getReviewById(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) createReview(c echo.Context) error {
	userId := c.Get("user_id").(string)
	dto := c.Get("body").(CreateReviewRequestDto)

	res, err := h.service.createReview(userId, dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) deleteReview(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.deleteReview(id)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) getReviewsByUsername(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) getReviewsByPoiId(c echo.Context) error {
	id := c.Param("id")
	params, err := pagination.GetParamsFromContext(c)

	if id == "" {
		return ErrIdRequired
	}

	if err != nil {
		return err
	}

	res, total, err := h.service.getReviewsByPoiId(id, params)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, total),
	})
}

func (h *handlers) uploadMedia(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = validateMpf(mpf)

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
