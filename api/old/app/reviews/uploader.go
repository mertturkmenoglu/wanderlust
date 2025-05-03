package reviews

import (
	"context"
	"mime/multipart"
	"slices"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/upload"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

type sImageUploader struct {
	mpf    *multipart.Form
	client *upload.Upload
}

type sFileInfo struct {
	file      multipart.File
	name      string
	extension string
	mime      string
	size      int64
}

const (
	maxMemory   = 1024 * 1024 * 10
	maxFileSize = 1024 * 1024 * 5
	bucketName  = "reviews"
)

var allowedMimeTypes = []string{
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
}

func isAllowedMimeType(mime string) bool {
	return slices.Contains(allowedMimeTypes, mime)
}

func isAllowedCount(n int) bool {
	return n == 1
}

func isAllowedFileSize(size int64) bool {
	return size <= maxFileSize
}

func validateMpf(mpf *multipart.Form) error {
	files := mpf.File["files"]

	if files == nil {
		return upload.ErrInvalidNumberOfFiles
	}

	num := len(files)

	if !isAllowedCount(num) {
		return upload.ErrInvalidNumberOfFiles
	}

	for _, f := range files {
		mime := f.Header.Get("Content-Type")

		if !isAllowedMimeType(mime) {
			return upload.ErrInvalidMimeType
		}

		if !isAllowedFileSize(f.Size) {
			return upload.ErrFileTooBig
		}
	}

	return nil
}

func (s *sImageUploader) GetSingleFile() (*sFileInfo, error) {
	files := s.mpf.File["files"]

	if files == nil || len(files) != 1 {
		return nil, upload.ErrInvalidNumberOfFiles
	}

	f := files[0]
	file, err := f.Open()

	if err != nil {
		return nil, err
	}

	mime := f.Header.Get("Content-Type")
	extension, err := upload.GetFileExtensionFromMimeType(mime)

	if err != nil {
		return nil, err
	}

	key := uuid.NewString()

	return &sFileInfo{
		file:      file,
		name:      key + "." + extension,
		mime:      mime,
		extension: extension,
		size:      f.Size,
	}, nil
}

func (s *sImageUploader) UploadFile(f *sFileInfo) (string, error) {
	cfg := config.GetConfiguration()

	protocol := "https"
	env := cfg.GetString(config.ENV)

	if env == "dev" {
		protocol = "http"
	}

	info, err := s.client.Client.PutObject(
		context.Background(),
		bucketName,
		f.name,
		f.file,
		int64(f.size),
		minio.PutObjectOptions{},
	)

	if err != nil {
		return "", err
	}

	url := protocol + "://" + cfg.GetString(config.MINIO_ENDPOINT) + "/" + info.Bucket + "/" + info.Key
	return url, nil
}
