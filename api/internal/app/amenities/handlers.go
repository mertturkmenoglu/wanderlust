package amenities

import (
	"net/http"
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
