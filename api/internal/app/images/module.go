package images

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/middlewares"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Images"}
	})

	s := Service{
		app: app,
	}

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/images/upload/",
			Summary:       "Get Presigned URL",
			Description:   "Get a presigned URL for uploading an image",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.PresignedUrlInput) (*dto.PresignedUrlOutput, error) {
			userId := ctx.Value("userId").(string)
			res, err := s.getPresignedURL(input.Bucket, input.FileExt)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to get presigned URL")
			}

			err = app.Cache.SetObj(cache.KeyBuilder(cache.KeyImageUpload, userId, res.Body.Id), res.Body, 0)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to save presigned URL to cache")
			}

			return res, nil
		},
	)
}
