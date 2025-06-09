package export

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

// GET /export/:id/status => Get status of the export task
// GET /export/:id => Get export data (not the real file, metadata)
// GET /export/list => List of all exports

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		*app,
		app.Db.Queries,
		app.Db.Pool,
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
}
