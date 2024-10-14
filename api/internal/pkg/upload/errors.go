package upload

import (
	"errors"
	"net/http"
	"wanderlust/internal/pkg/core/errors"
)

var (
	ErrInvalidBucketType    = errs.NewApiError(http.StatusUnprocessableEntity, "0200", errors.New("bucket type is invalid"))
	ErrInvalidCount         = errs.NewApiError(http.StatusUnprocessableEntity, "0201", errors.New("count is invalid"))
	ErrCountValue           = errs.NewApiError(http.StatusUnprocessableEntity, "0202", errors.New("count must be between 1 and 4"))
	ErrInvalidMimeType      = errs.NewApiError(http.StatusUnprocessableEntity, "0203", errors.New("mime type is not allowed"))
	ErrPresignedUrlCreation = errs.NewApiError(http.StatusInternalServerError, "0204", errors.New("cannot create presigned url"))
	ErrInvalidFile          = errs.NewApiError(http.StatusUnprocessableEntity, "0205", errors.New("invalid file"))
	ErrParseMultipartForm   = errs.NewApiError(http.StatusInternalServerError, "0206", errors.New("cannot parse multipart form"))
	ErrInvalidNumberOfFiles = errs.NewApiError(http.StatusUnprocessableEntity, "0207", errors.New("invalid number of files"))
	ErrFileTooBig           = errs.NewApiError(http.StatusRequestEntityTooLarge, "0208", errors.New("file too big"))
)
