package cities

import (
	"net/http"
	"strconv"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) Get(c echo.Context) error {
	idStr := c.Param("id")

	if idStr == "" {
		return ErrIdRequired
	}

	id, err := strconv.ParseInt(idStr, 10, 32)

	if err != nil {
		return ErrInvalidId
	}

	res, err := h.service.get(int32(id))

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) List(c echo.Context) error {
	res, err := h.service.list()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) Featured(c echo.Context) error {
	res, err := h.service.featured()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) Create(c echo.Context) error {
	dto := c.Get("body").(CreateReqDto)

	res, err := h.service.create(dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) Remove(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	err = h.service.remove(int32(idInt))

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) Update(c echo.Context) error {
	dto := c.Get("body").(UpdateReqDto)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	res, err := h.service.update(int32(idInt), dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
