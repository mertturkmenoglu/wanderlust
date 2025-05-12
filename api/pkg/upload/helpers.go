package upload

import "fmt"

func GetFileExtensionFromMimeType(mimeType string) (string, error) {
	switch mimeType {
	case "image/jpeg":
		return "jpg", nil
	case "image/jpg":
		return "jpg", nil
	case "image/png":
		return "png", nil
	case "image/gif":
		return "gif", nil
	case "image/webp":
		return "webp", nil
	default:
		return "", ErrInvalidMimeType
	}
}

func ConstructFilename(key string, fileExtension string) string {
	return fmt.Sprintf("%s.%s", key, fileExtension)
}
