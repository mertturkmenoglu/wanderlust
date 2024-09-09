package uploads

import "slices"

var allowedMimeTypes = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
}

var allowedUploadTypes = []string{
	"reviews",
	"hservices",
}

func isAllowedUploadType(s string) bool {
	return slices.Contains(allowedUploadTypes, s)
}

func isAllowedMimeType(s string) bool {
	return slices.Contains(allowedMimeTypes, s)
}

func isAllowedCount(n int) bool {
	return n > 0 && n < 4
}
