package pois

import (
	"mime/multipart"
	"slices"
	"wanderlust/internal/pkg/upload"
)

const (
	maxFileSize = 1024 * 1024 * 10     // 10 MB
	maxMemory   = 1024*1024*10*10 + 10 // 110 MB
)

type ImageUploadValidator struct {
	mpf *multipart.Form
}

var allowedMimeTypes = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
}

func (s *ImageUploadValidator) Validate() error {
	idArr := s.mpf.Value["id"]

	if idArr == nil || len(idArr) != 1 {
		return ErrIdRequired
	}

	files := s.mpf.File["files"]

	if files == nil {
		return upload.ErrInvalidNumberOfFiles
	}

	num := len(files)

	if !s.isAllowedCount(num) {
		return upload.ErrInvalidNumberOfFiles
	}

	// Check content type and size
	for _, f := range files {
		mime := f.Header.Get("Content-Type")

		if !s.isAllowedMimeType(mime) {
			return upload.ErrInvalidMimeType
		}

		if !s.isAllowedFileSize(f.Size) {
			return upload.ErrFileTooBig
		}
	}

	return nil
}

func (s *ImageUploadValidator) isAllowedMimeType(mime string) bool {
	return slices.Contains(allowedMimeTypes, mime)
}

func (s *ImageUploadValidator) isAllowedCount(n int) bool {
	return n == 1
}

func (s *ImageUploadValidator) isAllowedFileSize(size int64) bool {
	return size <= maxFileSize
}
