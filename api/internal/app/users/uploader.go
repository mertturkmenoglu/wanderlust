package users

import (
	"context"
	"mime/multipart"
	"wanderlust/config"
	"wanderlust/internal/pkg/upload"

	"github.com/minio/minio-go/v7"
	"github.com/spf13/viper"
)

type sImageUploader struct {
	action   imageUploadAction
	mpf      *multipart.Form
	client   *upload.Upload
	username string
}

type sFileInfo struct {
	file      multipart.File
	name      string
	extension string
	mime      string
	size      int64
}

func (s *sImageUploader) GetBucketName() string {
	switch s.action {
	case updateProfileImage:
		return "profile-images"
	case updateBannerImage:
		return "banner-images"
	default:
		panic("Invalid action")
	}
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

	return &sFileInfo{
		file:      file,
		name:      s.username + "." + extension,
		mime:      mime,
		extension: extension,
		size:      f.Size,
	}, nil
}

func (s *sImageUploader) UploadFile(f *sFileInfo) (string, error) {
	bucket := s.GetBucketName()

	info, err := s.client.Client.PutObject(
		context.Background(),
		bucket,
		f.name,
		f.file,
		int64(f.size),
		minio.PutObjectOptions{},
	)

	if err != nil {
		return "", err
	}

	url := "//" + viper.GetString(config.MINIO_ENDPOINT) + "/" + info.Bucket + "/" + info.Key
	return url, nil
}

func (s *sImageUploader) DeleteOldFile(f *sFileInfo) error {
	bucket := s.GetBucketName()

	for _, mime := range allowedMimeTypes {
		ext, _ := upload.GetFileExtensionFromMimeType(mime)

		if ext == f.extension {
			// Skip the current file extension
			continue
		}

		name := s.username + "." + ext
		err := s.client.Client.RemoveObject(context.Background(), bucket, name, minio.RemoveObjectOptions{})

		if err != nil {
			return err
		}
	}

	return nil
}
