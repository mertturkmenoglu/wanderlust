package diary

import (
	"context"
	"mime/multipart"
	"strconv"
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
	file       multipart.File
	name       string
	extension  string
	mime       string
	size       int64
	caption    string
	alt        string
	mediaOrder int16
}

const bucketName = "diaries"

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

	captionArr := s.mpf.Value["caption"]
	altArr := s.mpf.Value["alt"]
	orderArr := s.mpf.Value["order"]

	if len(captionArr) != 1 || len(altArr) != 1 || len(orderArr) != 1 {
		return nil, upload.ErrInvalidNumberOfFiles
	}

	orderInt, err := strconv.Atoi(orderArr[0])

	if err != nil {
		return nil, err
	}

	return &sFileInfo{
		file:       file,
		name:       key + "." + extension,
		mime:       mime,
		extension:  extension,
		size:       f.Size,
		caption:    captionArr[0],
		alt:        altArr[0],
		mediaOrder: int16(orderInt),
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
