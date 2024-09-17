package cities

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired   = api.NewApiError(http.StatusBadRequest, "0300", errors.New("id is required"))
	ErrInvalidId    = api.NewApiError(http.StatusBadRequest, "0301", errors.New("invalid id"))
	ErrCityNotFound = api.NewApiError(http.StatusNotFound, "0302", errors.New("city not found"))
)
