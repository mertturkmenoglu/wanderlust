package trips

import (
	"context"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
)

type Service struct {
	app *core.Application
}

func (s *Service) getTripById(ctx context.Context, id string) (*dto.GetTripByIdOutput, error) {
	return nil, nil
}
