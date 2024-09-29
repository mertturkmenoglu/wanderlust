package pois

import "slices"

const maxFileSize = 1024 * 1024 * 10   // 10 MB
const maxMemory = 1024*1024*10*10 + 10 // 110 MB

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
	return n > 0 && n <= 10
}

func isAllowedFileSize(size int64) bool {
	return size <= maxFileSize
}
