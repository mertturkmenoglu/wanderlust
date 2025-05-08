package reviews

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

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

func (h *handlers) getPoiRatings(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getPoiRatings(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
