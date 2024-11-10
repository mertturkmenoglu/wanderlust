package reviews

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired = errs.NewApiError(http.StatusBadRequest, "0800", errors.New("id is required"))
	ErrNotFound   = errs.NewApiError(http.StatusNotFound, "0801", errors.New("review not found"))
)
