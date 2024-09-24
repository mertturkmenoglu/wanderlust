package pois

import (
	"fmt"
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetPoiById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	fmt.Println("id is: ", id)

	res, err := h.service.getPoiById(id)

	if err != nil {
		fmt.Println("err is: ", err)
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
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
