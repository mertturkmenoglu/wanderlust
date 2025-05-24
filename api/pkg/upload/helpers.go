package upload

import (
	"fmt"
	"strings"

	"github.com/minio/minio-go/v7"
)

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

// Get the object name from the URL
func (svc *UploadService) GetObjectNameFromUrl(url string, bucket BucketName) string {
	endpoint := svc.Client.EndpointURL().String()
	removePrefix := endpoint + "/" + string(bucket) + "/"
	after, _ := strings.CutPrefix(url, removePrefix)
	return after
}

// Given the URL and the bucket name, remove the object from the bucket.
// URL is used to get the object name.
func (svc *UploadService) RemoveFileFromUrl(url string, bucket BucketName) error {
	objectName := svc.GetObjectNameFromUrl(url, bucket)

	return svc.Client.RemoveObject(
		svc.Context,
		string(bucket),
		objectName,
		minio.RemoveObjectOptions{},
	)
}
