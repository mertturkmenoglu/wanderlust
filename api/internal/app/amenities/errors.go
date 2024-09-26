package amenities

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired = api.NewApiError(http.StatusBadRequest, "0350", errors.New("id is required"))
	ErrInvalidId  = api.NewApiError(http.StatusBadRequest, "0351", errors.New("invalid id"))
)
