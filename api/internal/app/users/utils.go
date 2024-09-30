package users

import "slices"

const maxMemory = 1024 * 1024 * 10       // 10 MB
const maxFileSize = 1024 * 1024 * 10 * 5 // 5 MB

var allowedMimeTypes = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
}

func isAllowedMimeType(s string) bool {
	return slices.Contains(allowedMimeTypes, s)
}

func isAllowedCount(n int) bool {
	return n == 1
}

func isAllowedFileSize(size int64) bool {
	return size <= maxFileSize
}
