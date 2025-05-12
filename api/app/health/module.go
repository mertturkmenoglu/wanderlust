package health

import (
	"context"
	"net/http"
	"wanderlust/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group) {
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
		func(ctx context.Context, input *dto.HealthInput) (*dto.HealthOutput, error) {
			return &dto.HealthOutput{
				Body: dto.HealthOutputBody{
					Message: "OK",
				},
			}, nil
		},
	)
}
