package users

import (
	"net/http"
	"wanderlust/internal/app/api"

	"github.com/labstack/echo/v4"
)

// Get User Profile By Username godoc
//
//	@Summary		Get user profile by username
//	@Description	Gets a user profile by username
//	@Tags			Users
//	@Accept			json
//	@Produce		json
//	@Param			username	path	string	true	"Username"
//	@Success		200	{object}	api.Response{data=GetUserProfileResponseDto}	"Successful request"
//	@Failure		400	{object}	api.ErrorResponse	"Bad Request"
//	@Failure		404	{object}	api.ErrorResponse	"Not Found"
//	@Failure		500	{object}	api.ErrorResponse	"Internal Server Error"
//	@Router			/users/{username} [get]
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
