package lists

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired       = api.NewApiError(http.StatusBadRequest, "0600", errors.New("id is required"))
	ErrListNotFound     = api.NewApiError(http.StatusNotFound, "0601", errors.New("list not found"))
	ErrUsernameRequired = api.NewApiError(http.StatusBadRequest, "0602", errors.New("username is required"))
	ErrUserNotFound     = api.NewApiError(http.StatusNotFound, "0603", errors.New("user not found"))
)
