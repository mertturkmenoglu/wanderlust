package favorites

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"

	"github.com/labstack/echo/v4"
)

func (h *handlers) createFavorite(c echo.Context) error {
	userId := c.Get("user_id").(string)
	dto := c.Get("body").(CreateFavoriteRequestDto)

	res, err := h.service.createFavorite(dto.PoiId, userId)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) deleteFavoriteByPoiId(c echo.Context) error {
	poiId := c.Param("id")
	userId := c.Get("user_id").(string)

	err := h.service.deleteFavoriteByPoiId(poiId, userId)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) getUserFavorites(c echo.Context) error {
	userId := c.Get("user_id").(string)
	params, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.getUserFavorites(userId, params.Offset, params.PageSize)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}

func (h *handlers) getUserFavoritesByUsername(c echo.Context) error {
	username := c.Param("username")
	params, err := pagination.GetParamsFromContext(c)

	if username == "" {
		return ErrUsernameRequired
	}

	if err != nil {
		return err
	}

	res, count, err := h.service.getUserFavoritesByUsername(username, params.Offset, params.PageSize)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}
