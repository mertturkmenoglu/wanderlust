package upload

import (
	"errors"
	"net/http"
	"wanderlust/internal/app/api"
)

var (
	ErrInvalidBucketType    = api.NewApiError(http.StatusUnprocessableEntity, "0200", errors.New("bucket type is invalid"))
	ErrInvalidCount         = api.NewApiError(http.StatusUnprocessableEntity, "0201", errors.New("count is invalid"))
	ErrCountValue           = api.NewApiError(http.StatusUnprocessableEntity, "0202", errors.New("count must be between 1 and 4"))
	ErrInvalidMimeType      = api.NewApiError(http.StatusUnprocessableEntity, "0203", errors.New("mime type is not allowed"))
	ErrPresignedUrlCreation = api.NewApiError(http.StatusInternalServerError, "0204", errors.New("cannot create presigned url"))
	ErrInvalidFile          = api.NewApiError(http.StatusUnprocessableEntity, "0205", errors.New("invalid file"))
	ErrParseMultipartForm   = api.NewApiError(http.StatusInternalServerError, "0206", errors.New("cannot parse multipart form"))
	ErrInvalidNumberOfFiles = api.NewApiError(http.StatusUnprocessableEntity, "0207", errors.New("invalid number of files"))
	ErrFileTooBig           = api.NewApiError(http.StatusRequestEntityTooLarge, "0208", errors.New("file too big"))
)
