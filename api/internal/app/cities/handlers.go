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

func (h *handlers) CreateCity(c echo.Context) error {
	dto := c.Get("body").(CreateCityRequestDto)

	res, err := h.service.createCity(dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: res,
	})
}

func (h *handlers) DeleteCity(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	err = h.service.deleteCity(int32(idInt))

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateCity(c echo.Context) error {
	dto := c.Get("body").(UpdateCityRequestDto)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	res, err := h.service.updateCity(int32(idInt), dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}
