package images

import (
	"context"
	"time"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"
)

type Service struct {
	app *core.Application
}

func (s *Service) getPresignedURL(bucket upload.BucketName, fileExt string) (*dto.PresignedUrlOutput, error) {
	id := utils.GenerateId(s.app.Flake)
	fileName := id + "." + fileExt
	url, err := s.app.Upload.Client.PresignedPutObject(context.Background(), string(bucket), fileName, 15*time.Minute)

	if err != nil {
		return nil, err
	}

	return &dto.PresignedUrlOutput{
		Body: dto.PresignedUrlOutputBody{
			Url:           url.String(),
			Id:            id,
			Bucket:        bucket,
			FileExtension: fileExt,
			FileName:      fileName,
		},
	}, nil
}
