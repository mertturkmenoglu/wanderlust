package assets

import (
	"context"
	"net/http"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/danielgtaylor/huma/v2"
	"gocloud.dev/blob"
)

type Service struct {
	cache *cache.Cache
}

func (s *Service) getPresignedURL(ctx context.Context, input *GetPresignedUrlInput) (*GetPresignedUrlOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	mime, err := storage.FileExtensionToMimeType(input.FileExt)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get mime type")
	}

	id := uid.UUID()
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

	out := GetPresignedUrlOutputBody{
		Url:           url,
		Id:            id,
		Bucket:        input.Bucket,
		FileExtension: input.FileExt,
		FileName:      fileName,
	}

	err = s.cache.SetObj(ctx, cache.KeyBuilder(cache.KeyImageUpload, id), out, 0)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to save presigned URL to cache")
	}

	return &GetPresignedUrlOutput{
		Body: out,
	}, nil
}
