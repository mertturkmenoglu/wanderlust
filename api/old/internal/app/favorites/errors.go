package favorites

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrUsernameRequired = errs.NewApiError(http.StatusBadRequest, "0500", errors.New("username is required"))
)
