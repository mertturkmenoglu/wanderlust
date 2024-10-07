package collections

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrIdRequired         = api.NewApiError(http.StatusBadRequest, "0550", errors.New("id is required"))
	ErrCollectionNotFound = api.NewApiError(http.StatusNotFound, "0551", errors.New("collection not found"))
)