package collections

import (
	"net/http"
	"wanderlust/internal/app/api"
	"wanderlust/internal/pagination"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetCollections(c echo.Context) error {
	params, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return err
	}

	res, count, err := h.service.getCollections(params)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.PaginatedResponse{
		Data:       res,
		Pagination: pagination.Compute(params, count),
	})
}

func (h *handlers) GetCollectionById(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getCollectionById(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}

func (h *handlers) CreateCollection(c echo.Context) error {
	dto := c.Get("body").(CreateCollectionRequestDto)

	res, err := h.service.createCollection(dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: res,
	})
}

func (h *handlers) DeleteCollection(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.deleteCollection(id)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateCollection(c echo.Context) error {
	id := c.Param("id")
	dto := c.Get("body").(UpdateCollectionRequestDto)

	if id == "" {
		return ErrIdRequired
	}

	err := h.service.updateCollection(id, dto)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) GetCollectionItems(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	res, err := h.service.getCollectionItems(id)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}

func (h *handlers) CreateCollectionItem(c echo.Context) error {
	collectionId := c.Param("id")
	dto := c.Get("body").(CreateCollectionItemRequestDto)

	if collectionId == "" {
		return ErrIdRequired
	}

	res, err := h.service.createCollectionItem(collectionId, dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: res,
	})
}

func (h *handlers) DeleteCollectionItem(c echo.Context) error {
	collectionId := c.Param("id")
	poiId := c.Param("poiId")

	if collectionId == "" || poiId == "" {
		return ErrIdRequired
	}

	err := h.service.deleteCollectionItem(collectionId, poiId)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateCollectionItems(c echo.Context) error {
	collectionId := c.Param("id")
	dto := c.Get("body").(UpdateCollectionItemsRequestDto)

	if collectionId == "" {
		return ErrIdRequired
	}

	err := h.service.updateCollectionItems(collectionId, dto)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}
