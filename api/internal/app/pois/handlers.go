package pois

import (
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetPoiById(c echo.Context) error {
	userId := c.Get("user_id").(string)
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getPoiById(id)

	if err != nil {
		return err
	}

	var isFavorite bool = false
	var isBookmarked bool = false

	if userId != "" {
		isFavorite = h.service.isFavorite(id, userId)
		isBookmarked = h.service.isBookmarked(id, userId)
	}

	return c.JSON(http.StatusOK, api.MetadataResponse{
		Data: res,
		Meta: echo.Map{
			"isFavorite":   isFavorite,
			"isBookmarked": isBookmarked,
		},
	})
}

func (h *handlers) PeekPois(c echo.Context) error {
	res, err := h.service.peekPois()

	if err != nil {
		return err
	}

	v, err := mapPeekPoisToDto(res)

	if err != nil {
		return ErrUnmarshal
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}
