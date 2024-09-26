package categories

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired = api.NewApiError(http.StatusBadRequest, "0400", errors.New("id is required"))
	ErrInvalidId  = api.NewApiError(http.StatusBadRequest, "0401", errors.New("invalid id"))
)
