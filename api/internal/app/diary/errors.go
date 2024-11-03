package diary

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired          = errs.NewApiError(http.StatusBadRequest, "0700", errors.New("id is required"))
	ErrDiaryEntryNotFound  = errs.NewApiError(http.StatusNotFound, "0701", errors.New("diary entry not found"))
	ErrMediaOrder          = errs.NewApiError(http.StatusInternalServerError, "0702", errors.New("media order cast error"))
	ErrPaginationFromParam = errs.NewApiError(http.StatusBadRequest, "0703", errors.New("pagination param 'from' is invalid or malformed"))
	ErrPaginationToParam   = errs.NewApiError(http.StatusBadRequest, "0704", errors.New("pagination param 'to' is invalid or malformed"))
	ErrPaginationDateRange = errs.NewApiError(http.StatusUnprocessableEntity, "0705", errors.New("pagination params 'from' and 'to' are not valid date range params"))
)
