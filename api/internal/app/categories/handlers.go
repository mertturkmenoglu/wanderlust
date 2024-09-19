package categories

import (
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetCategories(c echo.Context) error {
	res, err := h.service.getCategories()

	if err != nil {
		return err
	}

	v := mapGetCategoriesToDto(res)

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}
