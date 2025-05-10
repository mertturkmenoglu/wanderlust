package collections

import (
	"net/http"
	"strconv"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetCollectionsForPoi(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getCollectionsForPoi(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) GetCollectionsForCity(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.ParseInt(id, 10, 32)

	if err != nil {
		return ErrCityIdFormat
	}

	res, err := h.service.getCollectionsForCity(int32(idInt))

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) GetAllPoiCollections(c echo.Context) error {
	res, err := h.service.getAllPoiCollections()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) GetAllCityCollections(c echo.Context) error {
	res, err := h.service.getAllCityCollections()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
