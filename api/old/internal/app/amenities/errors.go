package amenities

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired = errs.NewApiError(http.StatusBadRequest, "0350", errors.New("id is required"))
	ErrInvalidId  = errs.NewApiError(http.StatusBadRequest, "0351", errors.New("invalid id"))
)
