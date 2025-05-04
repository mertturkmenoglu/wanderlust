package users

import (
	"net/http"
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/labstack/echo/v4"
)

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
func (h *handlers) FollowUser(c echo.Context) error {
	username := c.Param("username")
	userId := c.Get("user_id").(string)
	authUser := c.Get("user").(db.User)

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

	if !isFollowing {
		_ = h.di.Activities.Add(userId, activities.ActivityFollow, activities.FollowPayload{
			ThisUsername:  authUser.Username,
			OtherUsername: username,
		})
	}

	return c.NoContent(http.StatusNoContent)
}
