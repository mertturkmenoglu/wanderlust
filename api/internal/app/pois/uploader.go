package pois

import (
	"mime/multipart"
	"wanderlust/config"
	"wanderlust/internal/upload"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/spf13/viper"
)

type ImageUploader struct {
	mpf     *multipart.Form
	client  *upload.Upload
	draftId string
}

type sFileInfo struct {
	file      multipart.File
	name      string
	extension string
	mime      string
	size      int64
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

	return &sFileInfo{
		file:      file,
		name:      newName + "." + extension,
		mime:      mime,
		extension: extension,
		size:      f.Size,
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

	url := "//" + viper.GetString(config.MINIO_ENDPOINT) + "/" + info.Bucket + "/" + info.Key
	return sUploadResult{
		url:  url,
		name: info.Key,
	}, nil
}

func (s *ImageUploader) deleteFile(name string) error {
	bucket := s.getBucketName()

	return s.client.Client.RemoveObject(s.client.Context, bucket, name, minio.RemoveObjectOptions{})
}
