package amenities

import (
	"net/http"
	"strconv"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetAmenities(c echo.Context) error {
	res, err := h.service.getAmenities()

	if err != nil {
		return err
	}

	v := mapGetAmenitiesToDto(res)

	return c.JSON(http.StatusOK, core.Response{
		Data: v,
	})
}

func (h *handlers) UpdateAmenity(c echo.Context) error {
	dto := c.Get("body").(UpdateAmenityRequestDto)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	err = h.service.updateAmenity(int32(idInt), dto)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) CreateAmenity(c echo.Context) error {
	dto := c.Get("body").(CreateAmenityRequestDto)

	res, err := h.service.createAmenity(dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) DeleteAmenity(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	err = h.service.deleteAmenity(int32(idInt))

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}
