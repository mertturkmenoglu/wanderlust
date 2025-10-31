package export

import (
	"context"
	"net/http"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)

	s := Service{
		cache: cacheSvc,
		db:    dbSvc.Queries,
		pool:  dbSvc.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Export"}
	})

	// Start new export task
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodPost,
			Path:          "/export/",
			Summary:       "Start New Export Task",
			Description:   "Start a new export task",
			DefaultStatus: http.StatusAccepted,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.StartNewExportTaskInput) (*dto.StartNewExportTaskOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.startNewExportTask(ctx, input.Body)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get export metadata
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/export/{id}",
			Summary:       "Get Export Metadata",
			Description:   "Get export metadata",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetExportByIdInput) (*dto.GetExportByIdOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.get(ctx, input.ID)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)

	// Get list of exports
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/export/",
			Summary:       "Get List of Exports",
			Description:   "Get list of exports",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *struct{}) (*dto.GetListOfExportsOutput, error) {
			ctx, sp := tracing.NewSpan(ctx)
			defer sp.End()

			res, err := s.list(ctx)

			if err != nil {
				sp.RecordError(err)
				return nil, err
			}

			return res, nil
		},
	)
}
