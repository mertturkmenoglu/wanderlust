package diary

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) getDiary(c echo.Context) error {
	return c.JSON(http.StatusOK, core.Response{
		Data: map[string]any{
			"foo": "bar",
		},
	})
}

func (h *handlers) createNewDiaryEntry(c echo.Context) error {
	userId := c.Get("user_id").(string)
	dto := c.Get("body").(CreateDiaryEntryRequestDto)

	res, err := h.service.createNewDiaryEntry(userId, dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: res,
	})
}

func (h *handlers) uploadDiaryMedia(c echo.Context) error {
	id := c.Param("id")

	if id == "" {
		return ErrIdRequired
	}

	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = h.service.validateMediaMPF(mpf)

	if err != nil {
		return err
	}

	res, err := h.service.uploadMedia(id, mpf)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, core.Response{
		Data: echo.Map{
			"url": res,
		},
	})
}
