package storage

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

var (
	ErrInvalidBucketType    = huma.Error422UnprocessableEntity("bucket type is invalid")
	ErrInvalidCount         = huma.Error422UnprocessableEntity("count is invalid")
	ErrCountValue           = huma.Error422UnprocessableEntity("count must be between 1 and 4")
	ErrInvalidMimeType      = huma.Error422UnprocessableEntity("mime type is not allowed")
	ErrPresignedUrlCreation = huma.Error500InternalServerError("cannot create presigned url")
	ErrInvalidFile          = huma.Error422UnprocessableEntity("invalid file")
	ErrInvalidFileExtension = huma.Error422UnprocessableEntity("invalid file extension")
	ErrParseMultipartForm   = huma.Error500InternalServerError("cannot parse multipart form")
	ErrInvalidNumberOfFiles = huma.Error422UnprocessableEntity("invalid number of files")
	ErrFileTooBig           = huma.NewError(http.StatusRequestEntityTooLarge, "file too big")
)
