package pois

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetPoiById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	return c.NoContent(http.StatusNoContent)
}
