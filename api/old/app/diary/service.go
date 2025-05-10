package diary

import (
	"mime/multipart"
	"wanderlust/internal/pkg/upload"
)

func (s *service) uploadMedia(id string, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		mpf:    mpf,
		client: s.di.Upload,
	}

	fileInfo, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer fileInfo.file.Close()

	url, err := uploader.UploadFile(fileInfo)

	if err != nil {
		return "", upload.ErrInvalidFile
	}

	err = s.repository.addMedia(id, url, fileInfo)

	if err != nil {
		return "", err
	}

	return url, nil
}
