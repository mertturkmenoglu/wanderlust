package pois

import (
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetPoiById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) PeekPois(c echo.Context) error {
	res, err := h.service.peekPois()

	if err != nil {
		return err
	}

	v, err := mapPeekPoisToDto(res)

	if err != nil {
		return ErrUnmarshal
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}
