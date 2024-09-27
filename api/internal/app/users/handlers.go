package users

import (
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetUserProfile(c echo.Context) error {
	username := c.Param("username")

	if username == "" {
		return ErrUsernameNotProvided
	}

	res, err := h.service.GetUserProfile(username)

	if err != nil {
		return err
	}

	v := mapGetUserProfileResponseToDto(res)

	return c.JSON(http.StatusOK, api.Response{
		Data: v,
	})
}

func (h *handlers) MakeUserVerified(c echo.Context) error {
	username := c.Param("username")

	if username == "" {
		return ErrUsernameNotProvided
	}

	res, err := h.service.GetUserProfile(username)

	if err != nil {
		return err
	}

	err = h.service.makeUserVerified(res.ID)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) UpdateUserProfile(c echo.Context) error {
	dto := c.Get("body").(UpdateUserProfileRequestDto)
	userId := c.Get("user_id").(string)

	res, err := h.service.updateUserProfile(userId, dto)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, api.Response{
		Data: res,
	})
}
