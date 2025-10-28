package images

import (
	"context"
	"net/http"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"gocloud.dev/blob"
)

type Service struct {
	app *core.Application
}

func (s *Service) getPresignedURL(ctx context.Context, input *dto.PresignedUrlInput) (*dto.PresignedUrlOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	mime, err := storage.FileExtensionToMimeType(input.FileExt)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get mime type")
	}

	id := s.app.ID.UUID()
	fileName := id + "." + input.FileExt

	bucket, err := storage.OpenBucket(ctx, storage.BucketName(input.Bucket))

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get bucket")
	}

	defer bucket.Close()

	url, err := bucket.SignedURL(
		ctx,
		fileName,
		&blob.SignedURLOptions{
			Expiry:      15 * time.Minute,
			Method:      http.MethodPut,
			ContentType: mime,
		},
	)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get presigned URL")
	}

	out := dto.PresignedUrlOutputBody{
		Url:           url,
		Id:            id,
		Bucket:        input.Bucket,
		FileExtension: input.FileExt,
		FileName:      fileName,
	}

	err = s.app.Cache.SetObj(ctx, cache.KeyBuilder(cache.KeyImageUpload, id), out, 0)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to save presigned URL to cache")
	}

	return &dto.PresignedUrlOutput{
		Body: out,
	}, nil
}
