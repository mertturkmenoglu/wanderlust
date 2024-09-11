package pois

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired = api.NewApiError(http.StatusBadRequest, "0300", errors.New("id is required"))
)
