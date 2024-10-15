package diary

import (
	"net/http"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) getDiary(c echo.Context) error {
	return c.JSON(http.StatusOK, core.Response{
		Data: map[string]any{
			"foo": "bar",
		},
	})
}
