package pois

import (
	"mime/multipart"
	"strconv"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/upload"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

type ImageUploader struct {
	mpf     *multipart.Form
	client  *upload.Upload
	draftId string
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

type sUploadResult struct {
	url  string
	name string
}

func (s *ImageUploader) getBucketName() string {
	return "pois"
}

func (s *ImageUploader) getSingleFile() (*sFileInfo, error) {
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

	newName := uuid.New().String()
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
		name:       newName + "." + extension,
		mime:       mime,
		extension:  extension,
		size:       f.Size,
		caption:    captionArr[0],
		alt:        altArr[0],
		mediaOrder: int16(orderInt),
	}, nil
}

func (s *ImageUploader) uploadFile(f *sFileInfo) (sUploadResult, error) {
	bucket := s.getBucketName()

	info, err := s.client.Client.PutObject(
		s.client.Context,
		bucket,
		f.name,
		f.file,
		int64(f.size),
		minio.PutObjectOptions{},
	)

	if err != nil {
		return sUploadResult{}, err
	}

	cfg := config.GetConfiguration()

	url := "http://" + cfg.GetString(config.MINIO_ENDPOINT) + "/" + info.Bucket + "/" + info.Key
	return sUploadResult{
		url:  url,
		name: info.Key,
	}, nil
}

func (s *ImageUploader) deleteFile(name string) error {
	bucket := s.getBucketName()

	return s.client.Client.RemoveObject(s.client.Context, bucket, name, minio.RemoveObjectOptions{})
}
