package lists

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/pagination"

	"github.com/labstack/echo/v4"
)

func (h *handlers) createList(c echo.Context) error {
	dto := c.Get("body").(CreateListRequestDto)
	userId := c.Get("user_id").(string)

	res, err := h.service.createList(dto, userId)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
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

	return c.JSON(http.StatusOK, core.PaginatedResponse{
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

	return c.JSON(http.StatusOK, core.Response{
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

	return c.JSON(http.StatusOK, core.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}

func (h *handlers) updateList(c echo.Context) error {
	id := c.Param("id")
	dto := c.Get("body").(UpdateListRequestDto)

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.updateList(id, dto)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
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
	dto := c.Get("body").(CreateListItemRequestDto)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.createListItem(id, dto.PoiID)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) deleteListItem(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) updateListItems(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) getListStatus(c echo.Context) error {
	poiId := c.Param("poiId")
	userId := c.Get("user_id").(string)

	if poiId == "" {
		return ErrIdRequired
	}

	res, err := h.service.getListStatus(userId, poiId)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
