package pois

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired = api.NewApiError(http.StatusBadRequest, "0300", errors.New("id is required"))
	ErrUnmarshal  = api.NewApiError(http.StatusInternalServerError, "0301", errors.New("cannot unmarshal"))
	ErrNotFound   = api.NewApiError(http.StatusNotFound, "0302", errors.New("not found"))
)
