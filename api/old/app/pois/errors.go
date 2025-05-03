package pois

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired = errs.NewApiError(http.StatusBadRequest, "0300", errors.New("id is required"))
	ErrUnmarshal  = errs.NewApiError(http.StatusInternalServerError, "0301", errors.New("cannot unmarshal"))
	ErrNotFound   = errs.NewApiError(http.StatusNotFound, "0302", errors.New("not found"))
)
