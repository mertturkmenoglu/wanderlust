package users

import (
	"errors"
	"wanderlust/internal/app/api"
)

var (
	ErrUserNotFound        = api.NewApiError("0100", errors.New("user not found"))
	ErrUsernameNotProvided = api.NewApiError("0101", errors.New("username not provided"))
)
