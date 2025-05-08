package reviews

import (
	"mime/multipart"
	"wanderlust/internal/pkg/upload"
)

func (s *service) uploadMedia(id string, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		mpf:    mpf,
		client: s.di.Upload,
	}

	f, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer f.file.Close()

	url, err := uploader.UploadFile(f)

	if err != nil {
		return "", upload.ErrInvalidFile
	}

	err = s.repository.addMedia(id, url)

	if err != nil {
		return "", err
	}

	return url, nil
}
