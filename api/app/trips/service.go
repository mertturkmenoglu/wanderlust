package trips

import (
	"context"
	"encoding/json"
	"errors"
	"time"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	app *core.Application
}

func (s *Service) getMany(ctx context.Context, ids []string) ([]dto.Trip, error) {
	res, err := s.app.Db.Queries.GetTripsByIdsPopulated(ctx, ids)

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

func (s *Service) get(ctx context.Context, id string) (*dto.Trip, error) {
	res, err := s.getMany(ctx, []string{id})

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
	trip, err := s.get(ctx, id)

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

func (s *Service) getAllTrips(ctx context.Context) (*dto.GetAllTripsOutput, error) {
	userId := ctx.Value("userId").(string)

	tripIds, err := s.app.Db.Queries.GetAllTripsIds(ctx, userId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get trips")
	}

	trips, err := s.getMany(ctx, tripIds)

	if err != nil {
		return nil, err
	}

	return &dto.GetAllTripsOutput{
		Body: dto.GetAllTripsOutputBody{
			Trips: trips,
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

func (s *Service) getMyInvites(ctx context.Context) (*dto.GetMyTripInvitesOutput, error) {
	userId := ctx.Value("userId").(string)

	dbInvites, err := s.app.Db.Queries.GetInvitesByToUserId(ctx, userId)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		var role dto.TripRole = dto.TRIP_ROLE_PARTICIPANT

		if dbInvite.TripsInvite.Role == "participant" {
			role = dto.TRIP_ROLE_PARTICIPANT
		} else if dbInvite.TripsInvite.Role == "editor" {
			role = dto.TRIP_ROLE_EDITOR
		} else {
			return nil, huma.Error500InternalServerError("Failed to get invites")
		}

		var fromUser dto.TripUser

		err := json.Unmarshal(dbInvite.Fromuser, &fromUser)

		if err != nil {
			return nil, huma.Error500InternalServerError("Failed to get invites")
		}

		invites[i] = dto.TripInvite{
			ID:   dbInvite.TripsInvite.ID,
			From: fromUser,
			To: dto.TripUser{
				ID: dbInvite.TripsInvite.ToID,
			},
			SentAt:    dbInvite.TripsInvite.SentAt.Time,
			ExpiresAt: dbInvite.TripsInvite.ExpiresAt.Time,
			Role:      role,
		}
	}

	return &dto.GetMyTripInvitesOutput{
		Body: dto.GetMyTripInvitesOutputBody{
			Invites: make([]dto.Trip, len(dbInvites)),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateTripInputBody) (*dto.CreateTripOutput, error) {
	_, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	startAt := time.Now().Add(time.Hour * 24 * 7)
	endAt := startAt.Add(time.Hour * 24 * 7)

	dbRes, err := s.app.Db.Queries.CreateTrip(ctx, db.CreateTripParams{
		ID:              utils.GenerateId(s.app.Flake),
		OwnerID:         userId,
		Title:           body.Title,
		VisibilityLevel: body.Visibility,
		Status:          "draft",
		StartAt:         pgtype.Timestamptz{Time: startAt, Valid: true},
		EndAt:           pgtype.Timestamptz{Time: endAt, Valid: true},
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create trip")
	}

	res, err := s.get(ctx, dbRes.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get trip")
	}

	return &dto.CreateTripOutput{
		Body: dto.CreateTripOutputBody{
			Trip: *res,
		},
	}, nil
}
