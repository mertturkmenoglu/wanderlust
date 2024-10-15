package users

import (
	"net/http"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/upload"

	"github.com/labstack/echo/v4"
)

func (h *handlers) GetUserProfile(c echo.Context) error {
	username := c.Param("username")
	userId := c.Get("user_id").(string)

	if username == "" {
		return ErrUsernameNotProvided
	}

	res, err := h.service.GetUserProfile(username)

	if err != nil {
		return err
	}

	v := mapGetUserProfileResponseToDto(res)

	var following = false

	if userId != "" {
		following, err = h.service.isUserFollowing(userId, res.ID)

		if err != nil {
			return err
		}
	}

	return c.JSON(http.StatusOK, core.MetadataResponse{
		Data: v,
		Meta: echo.Map{
			"isFollowing": following,
		},
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

	return c.JSON(http.StatusOK, core.Response{
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

	return c.JSON(http.StatusCreated, core.Response{
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

	return c.JSON(http.StatusCreated, core.Response{
		Data: echo.Map{
			"url": res,
		},
	})
}

func (h *handlers) FollowUser(c echo.Context) error {
	username := c.Param("username")
	userId := c.Get("user_id").(string)

	if username == "" {
		return ErrUsernameNotProvided
	}

	otherUser, err := h.service.GetUserProfile(username)

	if err != nil {
		return err
	}

	isFollowing, err := h.service.isUserFollowing(userId, otherUser.ID)

	if err != nil {
		return err
	}

	err = h.service.changeFollow(isFollowing, userId, otherUser.ID)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *handlers) GetUserFollowers(c echo.Context) error {
	username := c.Param("username")

	if username == "" {
		return ErrUsernameNotProvided
	}

	res, err := h.service.getUserFollowers(username)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}

func (h *handlers) GetUserFollowing(c echo.Context) error {
	username := c.Param("username")

	if username == "" {
		return ErrUsernameNotProvided
	}

	res, err := h.service.getUserFollowing(username)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, core.Response{
		Data: res,
	})
}
