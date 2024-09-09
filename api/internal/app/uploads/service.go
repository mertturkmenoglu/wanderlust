package uploads

import (
	"context"
	"time"
	"wanderlust/config"

	"github.com/google/uuid"
	"github.com/spf13/viper"
)

func (s *service) getPresignedUrls(qType string, count int, mime string) ([]UploadObj, error) {
	data := make([]UploadObj, count)

	for i := 0; i < count; i++ {
		key := uuid.New().String()
		fileExtension, err := getFileExtensionFromMimeType(mime)

		if err != nil {
			return nil, err
		}

		// Filename is random uuid + file extension
		filename := constructFilename(key, fileExtension)

		// Expiration time for the presigned url
		exp := time.Duration(viper.GetInt(config.UPLOAD_PRESIGNED_URL_EXP_MIN)) * time.Minute

		// Get the presigned url for the file
		url, err := s.upload.Client.PresignedPutObject(context.Background(), qType, filename, exp)

		if err != nil {
			return nil, err
		}

		data[i] = UploadObj{
			Url: url.String(),
			Key: key,
		}
	}

	return data, nil
}
