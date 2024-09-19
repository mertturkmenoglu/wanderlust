package cities

import (
	"net/http"
	"strconv"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetCityById(c echo.Context) error {
	idStr := c.Param("id")

	if idStr == "" {
		return ErrIdRequired
	}

	id, err := strconv.ParseInt(idStr, 10, 32)

	if err != nil {
		return ErrInvalidId
	}

	res, err := h.service.getCityById(int32(id))

	if err != nil {
		return err
	}

	v := mapGetCityByIdRowToDto(res)

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}

func (h *handlers) GetCities(c echo.Context) error {
	res, err := h.service.getCities()

	if err != nil {
		return err
	}

	v := mapGetCitiesToDto(res)

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}

func (h *handlers) GetFeaturedCities(c echo.Context) error {
	res, err := h.service.getFeaturedCities()

	if err != nil {
		return err
	}

	v := mapGetFeaturedCitiesToDto(res)

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}
