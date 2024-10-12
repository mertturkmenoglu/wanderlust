package lists

import (
	"net/http"
	"wanderlust/internal/app/api"
	"wanderlust/internal/pagination"

	"github.com/labstack/echo/v4"
)

func (h *handlers) createList(c echo.Context) error {
	dto := c.Get("body").(CreateListRequestDto)
	userId := c.Get("user_id").(string)

	res, err := h.service.createList(dto, userId)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: res,
	})
}

func (h *handlers) getAllListsOfUser(c echo.Context) error {
	userId := c.Get("user_id").(string)
	params, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.getAllListsOfUser(userId, params)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}

func (h *handlers) getListById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getListById(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}

func (h *handlers) getPublicListsOfUser(c echo.Context) error {
	username := c.Param("username")

	if username == "" {
		return ErrUsernameRequired
	}

	params, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.getPublicListsOfUser(username, params)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}

func (h *handlers) updateList(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) deleteList(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.deleteList(id)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) createListItem(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) deleteListItem(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) updateListItems(c echo.Context) error {
	return echo.ErrNotImplemented
}
