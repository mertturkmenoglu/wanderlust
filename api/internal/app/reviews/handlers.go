package reviews

import (
	"net/http"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) getReviewById(c echo.Context) error {
	return echo.ErrNotImplemented
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
	return echo.ErrNotImplemented
}

func (h *handlers) getReviewsByUsername(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) getReviewsByPoiId(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) uploadMedia(c echo.Context) error {
	return echo.ErrNotImplemented
}
