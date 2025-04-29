package health

import (
	"context"
	"net/http"
	"wanderlust/internal/pkg/dto"

	"github.com/danielgtaylor/huma/v2"
)

func Register(api *huma.API) {
	huma.Register(*api, huma.Operation{
		Method:        http.MethodGet,
		Path:          "/health",
		Summary:       "Get Health",
		OperationID:   "get-health",
		Description:   "A simple health check mechanism to verify that the API is operational",
		Tags:          []string{"Health"},
		DefaultStatus: http.StatusOK,
	}, func(ctx context.Context, input *dto.HealthInput) (*dto.HealthOutput, error) {
		return &dto.HealthOutput{
			Body: dto.HealthOutputBody{
				Message: "OK",
			},
		}, nil
	})
}
