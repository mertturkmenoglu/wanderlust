package lists

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired       = errs.NewApiError(http.StatusBadRequest, "0600", errors.New("id is required"))
	ErrListNotFound     = errs.NewApiError(http.StatusNotFound, "0601", errors.New("list not found"))
	ErrUsernameRequired = errs.NewApiError(http.StatusBadRequest, "0602", errors.New("username is required"))
	ErrUserNotFound     = errs.NewApiError(http.StatusNotFound, "0603", errors.New("user not found"))
	ErrListIndexCast    = errs.NewApiError(http.StatusInternalServerError, "0604", errors.New("cannot cast index value"))
)
