package cities

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired   = errs.NewApiError(http.StatusBadRequest, "0300", errors.New("id is required"))
	ErrInvalidId    = errs.NewApiError(http.StatusBadRequest, "0301", errors.New("invalid id"))
	ErrCityNotFound = errs.NewApiError(http.StatusNotFound, "0302", errors.New("city not found"))
)
