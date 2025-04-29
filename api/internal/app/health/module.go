package health

import (
	"context"
	"wanderlust/internal/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

func Register(grp *huma.Group) {
	grp.UseSimpleModifier(func(op *huma.Operation) {
		op.Tags = []string{"Health"}
	})

	huma.Get(grp, "/health", func(ctx context.Context, input *dto.HealthInput) (*dto.HealthOutput, error) {
		return &dto.HealthOutput{
			Body: dto.HealthOutputBody{
				Message: "OK",
			},
		}, nil
	}, func(o *huma.Operation) {
		o.Summary = "Get Health"
		o.Description = "A simple health check mechanism to verify that the API is operational"
	})
}
