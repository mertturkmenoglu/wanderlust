package aggregator

import (
	"net/http"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) HomeAggregation(c echo.Context) error {
	res, err := h.service.getHomeAggregation()

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
