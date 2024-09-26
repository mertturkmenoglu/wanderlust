package amenities

import (
	"net/http"
	"strconv"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetAmenities(c echo.Context) error {
	res, err := h.service.getAmenities()

	if err != nil {
		return err
	}

	v := mapGetAmenitiesToDto(res)

	return c.JSON(http.StatusOK, api.Response{
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
