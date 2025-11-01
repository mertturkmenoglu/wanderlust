package health

import (
	"context"
	"net/http"
	"wanderlust/pkg/core"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group, app *core.Application) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Health"}
	})

	huma.Register(grp,
		huma.Operation{
			Method:        http.MethodGet,
			Path:          "/health",
			Summary:       "Get Health",
			Description:   "A simple health check mechanism to verify that the API is operational",
			DefaultStatus: http.StatusOK,
		},
		func(ctx context.Context, input *HealthInput) (*HealthOutput, error) {
			_, sp := tracing.NewSpan(ctx)
			defer sp.End()

			return &HealthOutput{
				Body: HealthOutputBody{
					Message: "OK",
				},
			}, nil
		},
	)
}
