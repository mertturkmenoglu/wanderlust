package categories

import (
	"net/http"
	"strconv"
	"wanderlust/internal/pkg/core"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetCategories(c echo.Context) error {
	res, err := h.service.getCategories()

	if err != nil {
		return err
	}

	v := mapGetCategoriesToDto(res)

	return c.JSON(http.StatusOK, core.Response{
		Data: v,
	})
}

func (h *handlers) CreateCategory(c echo.Context) error {
	dto := c.Get("body").(CreateCategoryRequestDto)

	res, err := h.service.createCategory(dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) DeleteCategory(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	err = h.service.deleteCategory(int16(idInt))

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateCategory(c echo.Context) error {
	dto := c.Get("body").(UpdateCategoryRequestDto)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		return ErrInvalidId
	}

	res, err := h.service.updateCategory(int16(idInt), dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
