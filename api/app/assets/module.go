package assets

import (
	"context"
	"net/http"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/di"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)

	s := Service{
		cache: cacheSvc,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Assets"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/assets/upload/",
			Summary:       "Get Presigned URL",
			Description:   "Get a presigned URL for uploading an asset",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *GetPresignedUrlInput) (*GetPresignedUrlOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.getPresignedURL(ctx, input)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
