package trips

import (
	"context"
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
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.app.Db.Queries.GetTripsByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	trips := make([]dto.Trip, len(res))

	for i, t := range res {
		v, err := mapper.ToTrip(t)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		trips[i] = v
	}

	return trips, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.getMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Trip not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get trip")
	}

	if len(res) == 0 {
		err = huma.Error404NotFound("Trip not found")
		sp.RecordError(err)
		return nil, err
	}

	return &res[0], nil
}

func (s *Service) getTripById(ctx context.Context, id string) (*dto.GetTripByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	trip, err := s.get(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	// Check authorization rules
	if !s.canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetTripByIdOutput{
		Body: dto.GetTripByIdOutputBody{
			Trip: *trip,
		},
	}, nil
}

func (s *Service) getAllTrips(ctx context.Context) (*dto.GetAllTripsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	rows, err := s.app.Db.Queries.GetAllTripsIds(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get trips")
	}

	tripIds := make([]string, len(rows))

	for i, row := range rows {
		tripIds[i] = row.ID
	}

	trips, err := s.getMany(ctx, tripIds)

	if err != nil {
		sp.RecordError(err)
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
		if trip.OwnerID == userId {
			return true
		}

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
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbInvites, err := s.app.Db.Queries.GetInvitesByToUserId(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := mapper.FromToUserRowToTripInvite(dbInvite)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		invites[i] = res
	}

	return &dto.GetMyTripInvitesOutput{
		Body: dto.GetMyTripInvitesOutputBody{
			Invites: invites,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateTripInputBody) (*dto.CreateTripOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("failed to create trip")
	}

	res, err := s.get(ctx, dbRes.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("failed to get trip")
	}

	return &dto.CreateTripOutput{
		Body: dto.CreateTripOutputBody{
			Trip: *res,
		},
	}, nil
}

func (s *Service) getInvitesByTripId(ctx context.Context, tripId string) (*dto.GetTripInvitesByTripIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	trip, err := s.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Trip not found")
	}

	if !s.canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	dbInvites, err := s.app.Db.Queries.GetInvitesByTripId(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := mapper.FromTripRowToTripInvite(dbInvite)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		invites[i] = res
	}

	return &dto.GetTripInvitesByTripIdOutput{
		Body: dto.GetTripInvitesByTripIdOutputBody{
			Invites: invites,
		},
	}, nil
}

func (s *Service) createInvite(ctx context.Context, tripId string, body dto.CreateTripInviteInputBody) (*dto.CreateTripInviteOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	trip, err := s.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !s.canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	if !s.canCreateInvite(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to invite users to this trip")
		sp.RecordError(err)
		return nil, err
	}

	sentAt := time.Now()
	expiresAt := sentAt.Add(time.Hour * 24 * 7)

	dbRes, err := s.app.Db.Queries.CreateTripInvite(ctx, db.CreateTripInviteParams{
		ID:     utils.GenerateId(s.app.Flake),
		TripID: tripId,
		FromID: userId,
		ToID:   body.ToID,
		Role:   body.Role,
		SentAt: pgtype.Timestamptz{
			Time:  sentAt,
			Valid: true,
		},
		ExpiresAt: pgtype.Timestamptz{
			Time:  expiresAt,
			Valid: true,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("failed to create invite")
	}

	res, err := s.getInvitesByTripId(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	for _, invite := range res.Body.Invites {
		if invite.ID == dbRes.ID {
			return &dto.CreateTripInviteOutput{
				Body: dto.CreateTripInviteOutputBody{
					Invite: invite,
				},
			}, nil
		}
	}

	return nil, huma.Error500InternalServerError("Failed to get invites")
}

func (s *Service) canCreateInvite(trip *dto.Trip, userId string) bool {
	if trip.OwnerID == userId {
		return true
	}

	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}
	}

	return false
}

func (s *Service) getInviteDetail(ctx context.Context, tripId string, inviteId string) (*dto.GetTripInviteDetailsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbInvites, err := s.app.Db.Queries.GetInvitesByTripId(ctx, tripId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Invite not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	var dbInvite *db.GetInvitesByTripIdRow = nil

	for _, inv := range dbInvites {
		if inv.TripsInvite.ID == inviteId {
			dbInvite = &inv
			break
		}
	}

	if dbInvite == nil {
		err = huma.Error404NotFound("Invite not found")
		sp.RecordError(err)
		return nil, err
	}

	trip, err := s.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Trip not found")
	}

	inviteDto, err := mapper.FromTripRowToTripInvite(*dbInvite)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if inviteDto.To.ID != userId {
		err = huma.Error403Forbidden("You are not authorized to access this invite")
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetTripInviteDetailsOutput{
		Body: dto.GetTripInviteDetailsOutputBody{
			InviteDetail: dto.TripInviteDetail{
				TripInvite: inviteDto,
				TripTitle:  trip.Title,
				StartAt:    trip.StartAt,
				EndAt:      trip.EndAt,
			},
		},
	}, nil
}

func (s *Service) acceptOrDeclineInvite(ctx context.Context, tripId string, inviteId string, action string) (*dto.TripInviteActionOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	inviteDetail, err := s.getInviteDetail(ctx, tripId, inviteId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	if action == "accept" {
		err = qtx.DeleteInvite(ctx, inviteId)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete invite")
		}

		_, err = qtx.AddParticipantToTrip(ctx, db.AddParticipantToTripParams{
			ID:     utils.GenerateId(s.app.Flake),
			UserID: userId,
			TripID: tripId,
			Role:   string(inviteDetail.Body.InviteDetail.Role),
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to add participant to trip")
		}
	} else if action == "decline" {
		err = qtx.DeleteInvite(ctx, inviteId)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete invite")
		}
	} else {
		err = huma.Error400BadRequest("Invalid action")
		sp.RecordError(err)
		return nil, err
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	var accepted bool = true

	if action == "decline" {
		accepted = false
	}

	return &dto.TripInviteActionOutput{
		Body: dto.TripInviteActionOutputBody{
			Accepted: accepted,
		},
	}, nil
}

func (s *Service) removeInvite(ctx context.Context, tripId string, inviteId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !s.canCreateInvite(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to remove this invite")
		sp.RecordError(err)
		return err
	}

	err = s.app.Db.Queries.DeleteInvite(ctx, inviteId)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete invite")
	}

	return nil
}

func (s *Service) removeParticipant(ctx context.Context, tripId string, participantId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !s.canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return err
	}

	if !s.canRemoveParticipant(trip, userId, participantId) {
		err = huma.Error403Forbidden("You are not authorized to remove this participant")
		sp.RecordError(err)
		return err
	}

	err = s.app.Db.Queries.DeleteParticipant(ctx, db.DeleteParticipantParams{
		TripID: tripId,
		UserID: participantId,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete participant")
	}

	return nil
}

func (s *Service) canRemoveParticipant(trip *dto.Trip, userId string, participantId string) bool {
	// You cannot remove the owner
	if participantId == trip.OwnerID {
		return false
	}

	// You can remove yourself regardless of the role
	if userId == participantId {
		return true
	}

	// Owner can remove anyone except themselves
	if trip.OwnerID == userId {
		return true
	}

	// If the action user is an editor, they can remove anyone except the owner and themselves
	for _, p := range trip.Participants {
		if p.ID == userId && p.Role == "editor" {
			return true
		}
	}

	// By default, you cannot remove anyone
	return false
}

func (s *Service) removeTrip(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.get(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if trip.OwnerID != userId {
		err = huma.Error403Forbidden("You are not authorized to delete this trip")
		sp.RecordError(err)
		return err
	}

	err = s.app.Db.Queries.DeleteTrip(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete trip")
	}

	return nil
}
