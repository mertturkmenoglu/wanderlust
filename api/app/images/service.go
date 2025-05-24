package images

import (
	"context"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

type Service struct {
	app *core.Application
}

func (s *Service) getPresignedURL(ctx context.Context, input *dto.PresignedUrlInput) (*dto.PresignedUrlOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	id := s.app.ID.UUID()
	fileName := id + "." + input.FileExt

	url, err := s.app.Upload.Client.PresignedPutObject(
		ctx,
		string(input.Bucket),
		fileName,
		15*time.Minute,
	)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get presigned URL")
	}

	out := dto.PresignedUrlOutputBody{
		Url:           url.String(),
		Id:            id,
		Bucket:        input.Bucket,
		FileExtension: input.FileExt,
		FileName:      fileName,
	}

	err = s.app.Cache.SetObj(cache.KeyBuilder(cache.KeyImageUpload, id), out, 0)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("failed to save presigned URL to cache")
	}

	return &dto.PresignedUrlOutput{
		Body: out,
	}, nil
}
