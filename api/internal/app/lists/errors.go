package lists

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired = api.NewApiError(http.StatusBadRequest, "0600", errors.New("id is required"))
)
