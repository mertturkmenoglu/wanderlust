package reports

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/middlewares"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

// POST /reports/
// GET /reports/
// GET /reports/search
// PATCH /reports/{id}
// DELETE /reports/{id}

func Register(grp *huma.Group, app *core.Application) {
	s := Service{
		*app,
		app.Db.Queries,
		app.Db.Pool,
	}

	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Reports"}
	})

	// Get Report
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reports/{id}",
			Summary:       "Get Report",
			Description:   "Get report by ID",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetReportByIdInput) (*dto.GetReportByIdOutput, error) {
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

	// Get Reports
	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/reports/",
			Summary:       "Get Reports",
			Description:   "Get reports",
			DefaultStatus: http.StatusOK,
			Middlewares: huma.Middlewares{
				middlewares.IsAuth(grp.API),
			},
			Security: core.OpenApiJwtSecurity,
		},
		func(ctx context.Context, input *dto.GetReportByIdInput) (*dto.GetReportByIdOutput, error) {
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
}
