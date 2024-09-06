package users

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrUserNotFound        = api.NewApiError(http.StatusNotFound, "0100", errors.New("user not found"))
	ErrUsernameNotProvided = api.NewApiError(http.StatusBadRequest, "0101", errors.New("username not provided"))
)
