package trips

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) getMany(ids []string) ([]dto.Trip, error) {
	res, err := s.app.Db.Queries.GetTripsByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, err
	}

	trips := make([]dto.Trip, len(res))

	for i, t := range res {
		v, err := mapper.ToTrip(t)

		if err != nil {
			return nil, err
		}

		trips[i] = v
	}

	return trips, nil
}

func (s *Service) get(id string) (*dto.Trip, error) {
	res, err := s.getMany([]string{id})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Trip not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get trip")
	}

	if len(res) == 0 {
		return nil, huma.Error404NotFound("Trip not found")
	}

	return &res[0], nil
}

func (s *Service) getTripById(ctx context.Context, id string) (*dto.GetTripByIdOutput, error) {
	trip, err := s.get(id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	// Check authorization rules
	if !s.canRead(trip, userId) {
		return nil, huma.Error403Forbidden("You are not authorized to access this trip")
	}

	return &dto.GetTripByIdOutput{
		Body: dto.GetTripByIdOutputBody{
			Trip: *trip,
		},
	}, nil
}

func (s *Service) canRead(trip *dto.Trip, userId string) bool {
	switch trip.VisibilityLevel {
	case dto.TRIP_VISIBILITY_LEVEL_PUBLIC:
		return true
	case dto.TRIP_VISIBILITY_LEVEL_FRIENDS:
		for _, friend := range trip.Participants {
			if friend.ID == userId {
				return true
			}
		}
		return false
	case dto.TRIP_VISIBILITY_LEVEL_PRIVATE:
		return trip.OwnerID == userId
	default:
		return false
	}
}
