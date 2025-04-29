package collections

import (
	"errors"
	"net/http"
	errs "wanderlust/internal/pkg/core/errors"
)

var (
	ErrIdRequired          = errs.NewApiError(http.StatusBadRequest, "0550", errors.New("id is required"))
	ErrCollectionNotFound  = errs.NewApiError(http.StatusNotFound, "0551", errors.New("collection not found"))
	ErrCollectionIndexCast = errs.NewApiError(http.StatusInternalServerError, "0552", errors.New("cannot cast index value"))
	ErrInvalidOrder        = errs.NewApiError(http.StatusBadRequest, "0553", errors.New("invalid order"))
	ErrPoiIdRequired       = errs.NewApiError(http.StatusBadRequest, "0554", errors.New("poi id is required"))
	ErrCityIdRequired      = errs.NewApiError(http.StatusBadRequest, "0555", errors.New("city id is required"))
	ErrCityIdFormat        = errs.NewApiError(http.StatusUnprocessableEntity, "0556", errors.New("city id should be a number string"))
)
