package users

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrUserNotFound        = errs.NewApiError(http.StatusNotFound, "0100", errors.New("user not found"))
	ErrUsernameNotProvided = errs.NewApiError(http.StatusBadRequest, "0101", errors.New("username not provided"))
	ErrInvalidUsername     = errs.NewApiError(http.StatusUnprocessableEntity, "0102", errors.New("invalid username"))
)
