package bookmarks

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"

	"github.com/labstack/echo/v4"
)

func (h *handlers) createBookmark(c echo.Context) error {
	userId := c.Get("user_id").(string)
	dto := c.Get("body").(CreateBookmarkRequestDto)

	res, err := h.service.createBookmark(dto.PoiId, userId)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) deleteBookmarkByPoiId(c echo.Context) error {
	poiId := c.Param("id")
	userId := c.Get("user_id").(string)

	err := h.service.deleteBookmarkByPoiId(poiId, userId)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) getUserBookmarks(c echo.Context) error {
	userId := c.Get("user_id").(string)
	params, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.getUserBookmarks(userId, params.Offset, params.PageSize)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}
