package diary

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired         = errs.NewApiError(http.StatusBadRequest, "0700", errors.New("id is required"))
	ErrDiaryEntryNotFound = errs.NewApiError(http.StatusNotFound, "0701", errors.New("diary entry not found"))
)
