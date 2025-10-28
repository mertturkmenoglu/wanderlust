package storage

import (
	"context"
	"path"
	"strings"
	"wanderlust/pkg/cfg"

	"github.com/google/uuid"
)

func MimeTypeToFileExtension(mimeType string) (string, error) {
	switch mimeType {
	case "image/jpeg":
		return "jpg", nil
	case "image/jpg":
		return "jpg", nil
	case "image/png":
		return "png", nil
	case "image/gif":
		return "gif", nil
	default:
		return "", ErrInvalidMimeType
	}
}

func FileExtensionToMimeType(fileExtension string) (string, error) {
	switch fileExtension {
	case "jpg":
		return "image/jpeg", nil
	case "jpeg":
		return "image/jpeg", nil
	case "png":
		return "image/png", nil
	case "gif":
		return "image/gif", nil
	default:
		return "", ErrInvalidFileExtension
	}
}

func RandFilename(ext string) string {
	return uuid.NewString() + "." + ext
}

func CreateFilename(key string, ext string) string {
	return key + "." + ext
}

func FileExists(ctx context.Context, bucket BucketName, filename string) bool {
	b, err := OpenBucket(ctx, bucket)

	if err != nil {
		return false
	}

	defer b.Close()

	ok, err := b.Exists(ctx, filename)

	if err != nil {
		return false
	}

	return ok
}

func GetUrl(ctx context.Context, bucket BucketName, filename string) (string, error) {
	return path.Join(cfg.Env.URL, "uploads", string(bucket), filename), nil
}

func GetFilename(ctx context.Context, url string) string {
	parts := strings.Split(url, "/")
	return parts[len(parts)-1]
}
