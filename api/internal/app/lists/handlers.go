package lists

import (
	"net/http"
	"wanderlust/internal/app/api"

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

func (h *handlers) getAllListOfUser(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) getListById(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) getPublicListsOfUser(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) updateList(c echo.Context) error {
	return echo.ErrNotImplemented
}

func (h *handlers) deleteList(c echo.Context) error {
	return echo.ErrNotImplemented
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
