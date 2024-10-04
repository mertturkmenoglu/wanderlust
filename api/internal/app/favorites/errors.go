package favorites

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrUsernameRequired = api.NewApiError(http.StatusBadRequest, "0500", errors.New("username is required"))
)
