package users

import (
	"net/http"
	"wanderlust/internal/app/api"
	"wanderlust/internal/db"
	"wanderlust/internal/upload"

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

func (h *handlers) UpdateProfileImage(c echo.Context) error {
	user := c.Get("user").(db.User)
	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = h.service.validateProfileImageMPF(mpf)

	if err != nil {
		return err
	}

	res, err := h.service.updateProfileImage(user, mpf)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: echo.Map{
			"url": res,
		},
	})
}

func (h *handlers) UpdateBannerImage(c echo.Context) error {
	user := c.Get("user").(db.User)
	err := c.Request().ParseMultipartForm(maxMemory)

	if err != nil {
		return upload.ErrParseMultipartForm
	}

	mpf := c.Request().MultipartForm
	err = h.service.validateBannerImageMPF(mpf)

	if err != nil {
		return err
	}

	res, err := h.service.updateBannerImage(user, mpf)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, api.Response{
		Data: echo.Map{
			"url": res,
		},
	})
}
