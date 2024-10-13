package users

import (
	"mime/multipart"
	"slices"
	"wanderlust/internal/pkg/upload"
)

type imageUploadAction string

var (
	updateProfileImage imageUploadAction = "update-profile-image"
	updateBannerImage  imageUploadAction = "update-banner-image"
)

const (
	maxMemory                     = 1024 * 1024 * 10     // 10 MB
	updateProfileImageMaxFileSize = 1024 * 1024 * 10 * 5 // 5 MB
	updateBannerImageMaxFileSize  = 1024 * 1024 * 10 * 5 // 5 MB
)

type sImageUploadValidator struct {
	action imageUploadAction
	mpf    *multipart.Form
}

var allowedMimeTypes = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
}

func (s *sImageUploadValidator) Validate() error {
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

func (s *sImageUploadValidator) isAllowedMimeType(mime string) bool {
	return slices.Contains(allowedMimeTypes, mime)
}

func (s *sImageUploadValidator) isAllowedCount(n int) bool {
	switch s.action {
	case updateProfileImage:
		return n == 1
	case updateBannerImage:
		return n == 1
	default:
		panic("Invalid action")
	}
}

func (s *sImageUploadValidator) isAllowedFileSize(size int64) bool {

	switch s.action {
	case updateProfileImage:
		return size <= updateProfileImageMaxFileSize
	case updateBannerImage:
		return size <= updateBannerImageMaxFileSize
	default:
		panic("Invalid action")
	}
}
