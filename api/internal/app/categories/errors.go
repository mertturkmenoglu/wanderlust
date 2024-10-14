package categories

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired = errs.NewApiError(http.StatusBadRequest, "0400", errors.New("id is required"))
	ErrInvalidId  = errs.NewApiError(http.StatusBadRequest, "0401", errors.New("invalid id"))
)
