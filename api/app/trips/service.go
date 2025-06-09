package trips

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
	"wanderlust/app/pois"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	core.Application
	poisService *pois.Service
	wg          *sync.WaitGroup
	db          *db.Queries
	pool        *pgxpool.Pool
}

func (s *Service) findMany(ctx context.Context, ids []string) ([]dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetTripsByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	trips := make([]dto.Trip, len(res))

	for i, r := range res {
		trip, err := mapper.ToTrip(r)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		trips[i] = trip
	}

	return trips, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.findMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Trip not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get trip")
	}

	if len(res) != 1 {
		err = huma.Error404NotFound("Trip not found")
		sp.RecordError(err)
		return nil, err
	}

	return &res[0], nil
}

func (s *Service) getTripById(ctx context.Context, id string) (*dto.GetTripByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	trip, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canRead(trip, userId) {
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

func (s *Service) getAllTrips(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetAllTripsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	rows, err := s.db.GetAllTripsIds(ctx, db.GetAllTripsIdsParams{
		OwnerID: userId,
		Offset:  int32(pagination.GetOffset(params)),
		Limit:   int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get trips")
	}

	tripIds := make([]string, len(rows))

	for i, row := range rows {
		tripIds[i] = row.ID
	}

	trips, err := s.findMany(ctx, tripIds)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.db.CountMyTrips(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get trips count")
	}

	return &dto.GetAllTripsOutput{
		Body: dto.GetAllTripsOutputBody{
			Trips:      trips,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getMyInvites(ctx context.Context) (*dto.GetMyTripInvitesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbInvites, err := s.db.GetInvitesByToUserId(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := mapper.ToTripInviteFromInvitesByUserIdRow(dbInvite)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to get invites")
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

	dbRes, err := s.db.CreateTrip(ctx, db.CreateTripParams{
		ID:              s.ID.Flake(),
		OwnerID:         userId,
		Title:           body.Title,
		Description:     body.Description,
		VisibilityLevel: body.Visibility,
		StartAt:         pgtype.Timestamptz{Time: body.StartAt, Valid: true},
		EndAt:           pgtype.Timestamptz{Time: body.EndAt, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create trip")
	}

	res, err := s.find(ctx, dbRes.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get trip")
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
	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Trip not found")
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	dbInvites, err := s.db.GetInvitesByTripId(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := mapper.ToTripInviteFromInvitesByTripIdRow(dbInvite)

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
	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	if !canCreateInvite(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to invite users to this trip")
		sp.RecordError(err)
		return nil, err
	}

	if trip.VisibilityLevel == dto.TRIP_VISIBILITY_LEVEL_PRIVATE {
		err = huma.Error400BadRequest("You cannot invite users to a private trip")
		sp.RecordError(err)
		return nil, err
	}

	sentAt := time.Now()
	expiresAt := sentAt.Add(time.Hour * 24 * 7)

	dbRes, err := s.db.CreateTripInvite(ctx, db.CreateTripInviteParams{
		ID:     s.ID.Flake(),
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
		TripTitle: trip.Title,
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

func (s *Service) getInviteDetail(ctx context.Context, tripId string, inviteId string) (*dto.GetTripInviteDetailsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbInvites, err := s.db.GetInvitesByTripId(ctx, tripId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Invite not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get invites")
	}

	var dbInvite *db.GetInvitesByTripIdRow = nil

	for _, inv := range dbInvites {
		if inv.TripInvite.ID == inviteId {
			dbInvite = &inv
			break
		}
	}

	if dbInvite == nil {
		err = huma.Error404NotFound("Invite not found")
		sp.RecordError(err)
		return nil, err
	}

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Trip not found")
	}

	inviteDto, err := mapper.ToTripInviteFromInvitesByTripIdRow(*dbInvite)

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

	if inviteDto.ExpiresAt.Before(time.Now()) {
		err = s.db.DeleteInvite(ctx, inviteId)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Invite expired and failed to delete invite")
		}

		return nil, huma.Error410Gone("Invite expired")
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

	if inviteDetail.Body.InviteDetail.ExpiresAt.Before(time.Now()) {
		err = s.db.DeleteInvite(ctx, inviteId)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Invite expired and failed to delete invite")
		}

		return nil, huma.Error410Gone("Invite expired")
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	if action == "accept" {
		err = qtx.DeleteInvite(ctx, inviteId)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete invite")
		}

		_, err = qtx.AddParticipantToTrip(ctx, db.AddParticipantToTripParams{
			ID:     s.ID.Flake(),
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

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !canCreateInvite(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to remove this invite")
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteInvite(ctx, inviteId)

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

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return err
	}

	if !canRemoveParticipant(trip, userId, participantId) {
		err = huma.Error403Forbidden("You are not authorized to remove this participant")
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteParticipant(ctx, db.DeleteParticipantParams{
		TripID: tripId,
		UserID: participantId,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete participant")
	}

	return nil
}

func (s *Service) removeTrip(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if trip.OwnerID != userId {
		err = huma.Error403Forbidden("You are not authorized to delete this trip")
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteTrip(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete trip")
	}

	return nil
}

func (s *Service) createComment(ctx context.Context, tripId string, body dto.CreateTripCommentInputBody) (*dto.CreateTripCommentOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canCreateComment(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to create a comment")
		sp.RecordError(err)
		return nil, err
	}

	res, err := s.db.CreateTripComment(ctx, db.CreateTripCommentParams{
		ID:      s.ID.Flake(),
		TripID:  tripId,
		FromID:  userId,
		Content: body.Content,
		CreatedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: true,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create comment")
	}

	return &dto.CreateTripCommentOutput{
		Body: dto.CreateTripCommentOutputBody{
			Comment: dto.TripComment{
				ID:        res.ID,
				TripID:    tripId,
				From:      dto.TripUser{ID: userId},
				Content:   body.Content,
				CreatedAt: res.CreatedAt.Time,
			},
		},
	}, nil
}

func (s *Service) getComments(ctx context.Context, tripId string, params dto.PaginationQueryParams) (*dto.GetTripCommentsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	if !canReadComment(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip's comments")
		sp.RecordError(err)
		return nil, err
	}

	dbComments, err := s.db.GetTripComments(ctx, db.GetTripCommentsParams{
		TripID: tripId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get comments")
	}

	comments := make([]dto.TripComment, len(dbComments))

	for i, dbComment := range dbComments {
		res, err := mapper.ToTripComment(dbComment)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to get comment")
		}

		comments[i] = res
	}

	count, err := s.db.GetTripCommentsCount(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get comments count")
	}

	return &dto.GetTripCommentsOutput{
		Body: dto.GetTripCommentsOutputBody{
			Comments:   comments,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) findCommentById(ctx context.Context, id string) (*dto.TripComment, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	comment, err := s.db.GetTripCommentById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Comment not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get comment")
	}

	res, err := mapper.ToTripCommentFromCommentByIdRow(comment)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get comment")
	}

	return &res, nil
}

func (s *Service) updateComment(ctx context.Context, input *dto.UpdateTripCommentInput) (*dto.UpdateTripCommentOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	comment, err := s.findCommentById(ctx, input.CommentID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canUpdateComment(comment, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this comment")
		sp.RecordError(err)
		return nil, err
	}

	_, err = s.db.UpdateTripComment(ctx, db.UpdateTripCommentParams{
		ID:      input.CommentID,
		TripID:  input.TripID,
		Content: input.Body.Content,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update comment")
	}

	updatedComment, err := s.findCommentById(ctx, input.CommentID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get comment")
	}

	return &dto.UpdateTripCommentOutput{
		Body: dto.UpdateTripCommentOutputBody{
			Comment: *updatedComment,
		},
	}, nil
}

func (s *Service) removeComment(ctx context.Context, tripId string, commentId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	comment, err := s.findCommentById(ctx, commentId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !canDeleteComment(trip, comment, userId) {
		err = huma.Error403Forbidden("You are not authorized to delete this comment")
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteTripComment(ctx, commentId)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("Comment not found")
		}

		return huma.Error500InternalServerError("Failed to delete comment")
	}

	return nil
}

func (s *Service) updateAmenities(ctx context.Context, tripId string, body dto.UpdateTripAmenitiesInputBody) (*dto.UpdateTripAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canManageAmenities(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to manage this trip")
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update amenities")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	err = qtx.DeleteTripAllAmenities(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update amenities")
	}

	batch := make([]db.BatchCreateTripAmenitiesParams, len(body.AmenityIds))

	for i, id := range body.AmenityIds {
		batch[i] = db.BatchCreateTripAmenitiesParams{
			TripID:    tripId,
			AmenityID: id,
		}
	}

	_, err = qtx.BatchCreateTripAmenities(ctx, batch)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update amenities")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update amenities")
	}

	trip, err = s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get trip")
	}

	return &dto.UpdateTripAmenitiesOutput{
		Body: dto.UpdateTripAmenitiesOutputBody{
			Amenities: trip.RequestedAmenities,
		},
	}, nil
}

func (s *Service) updateTrip(ctx context.Context, id string, body dto.UpdateTripInputBody) (*dto.UpdateTripOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canUpdateTrip(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this trip")
		sp.RecordError(err)
		return nil, err
	}

	var isDateChanged = false

	if !body.StartAt.Equal(trip.StartAt) {
		isDateChanged = true
	}

	if !body.EndAt.Equal(trip.EndAt) {
		isDateChanged = true
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	updateResult, err := qtx.UpdateTrip(ctx, db.UpdateTripParams{
		ID:              trip.ID,
		Title:           body.Title,
		Description:     body.Description,
		VisibilityLevel: body.VisibilityLevel,
		StartAt: pgtype.Timestamptz{
			Time:  body.StartAt,
			Valid: true,
		},
		EndAt: pgtype.Timestamptz{
			Time:  body.EndAt,
			Valid: true,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update trip")
	}

	if isDateChanged {
		err = qtx.MoveDanglingLocations(ctx, db.MoveDanglingLocationsParams{
			TripID:          trip.ID,
			ScheduledTime:   updateResult.StartAt,
			ScheduledTime_2: updateResult.StartAt,
			ScheduledTime_3: updateResult.EndAt,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to move dangling locations")
		}
	}

	if updateResult.VisibilityLevel == "private" {
		err = qtx.DeleteTripAllParticipants(ctx, trip.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete trip all participants")
		}

		err = qtx.DeleteTripAllComments(ctx, trip.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete trip all comments")
		}

		err = qtx.DeleteTripAllInvites(ctx, trip.ID)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to delete trip all invites")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	return nil, nil
}

func (s *Service) createTripLocation(ctx context.Context, tripId string, body dto.CreateTripLocationInputBody) (*dto.CreateTripLocationOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canCreateLocation(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to create a location for this trip")
		sp.RecordError(err)
		return nil, err
	}

	if body.ScheduledTime.Before(trip.StartAt) {
		err = huma.Error400BadRequest("Scheduled time must be after the trip start time")
		sp.RecordError(err)
		return nil, err
	}

	if body.ScheduledTime.After(trip.EndAt) {
		err = huma.Error400BadRequest("Scheduled time must be before the trip end time")
		sp.RecordError(err)
		return nil, err
	}

	var description = ""

	if body.Description != nil {
		description = *body.Description
	}

	res, err := s.db.CreateTripLocation(ctx, db.CreateTripLocationParams{
		ID:     s.ID.Flake(),
		TripID: tripId,
		PoiID:  body.PoiID,
		ScheduledTime: pgtype.Timestamptz{
			Time:  body.ScheduledTime,
			Valid: true,
		},
		Description: description,
	})

	if err != nil {
		sp.RecordError(err)

		var pgErr *pgconn.PgError

		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case db.FOREIGN_KEY_VIOLATION:
				return nil, huma.Error404NotFound(fmt.Sprintf("Point of Interest with the ID %s not found", body.PoiID))
			case db.UNIQUE_VIOLATION:
				return nil, huma.Error400BadRequest(fmt.Sprintf("Location with the Point of Interest ID %s already exists", body.PoiID))
			}
		}

		return nil, huma.Error400BadRequest("Failed to create location")
	}

	return &dto.CreateTripLocationOutput{
		Body: dto.CreateTripLocationOutputBody{
			Location: dto.TripLocation{
				ID:            res.ID,
				TripID:        tripId,
				ScheduledTime: res.ScheduledTime.Time,
				Description:   res.Description,
				PoiID:         res.PoiID,
				Poi:           dto.Poi{},
			},
		},
	}, nil
}

func (s *Service) findTripLocationById(ctx context.Context, id string) (*dto.TripLocation, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	location, err := s.db.GetTripLocationById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Location not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get location")
	}

	dbPoi, err := s.db.GetPoisByIdsPopulated(ctx, []string{location.TripLocation.PoiID})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get poi")
	}

	pois, err := mapper.ToPois(dbPoi[0])

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get poi")
	}

	poi := pois[0]

	return &dto.TripLocation{
		ID:            location.TripLocation.ID,
		TripID:        location.TripLocation.TripID,
		ScheduledTime: location.TripLocation.ScheduledTime.Time,
		Description:   location.TripLocation.Description,
		PoiID:         location.TripLocation.PoiID,
		Poi:           poi,
	}, nil
}

func (s *Service) updateTripLocation(ctx context.Context, input *dto.UpdateTripLocationInput) (*dto.UpdateTripLocationOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, input.TripID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, err
	}

	if !canUpdateTripLocation(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this trip location")
		sp.RecordError(err)
		return nil, err
	}

	location, err := s.findTripLocationById(ctx, input.LocationID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	var description = location.Description
	var scheduledTime = location.ScheduledTime

	if input.Body.Description != nil {
		description = *input.Body.Description
	}

	if input.Body.ScheduledTime != nil {
		scheduledTime = *input.Body.ScheduledTime
	}

	if scheduledTime.Before(trip.StartAt) {
		err = huma.Error400BadRequest("Scheduled time must be after the trip start time")
		sp.RecordError(err)
		return nil, err
	}

	if scheduledTime.After(trip.EndAt) {
		err = huma.Error400BadRequest("Scheduled time must be before the trip end time")
		sp.RecordError(err)
		return nil, err
	}

	_, err = s.db.UpdateTripLocation(ctx, db.UpdateTripLocationParams{
		ID:          input.LocationID,
		TripID:      input.TripID,
		Description: description,
		ScheduledTime: pgtype.Timestamptz{
			Time:  scheduledTime,
			Valid: true,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update location")
	}

	location, err = s.findTripLocationById(ctx, input.LocationID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdateTripLocationOutput{
		Body: dto.UpdateTripLocationOutputBody{
			Location: *location,
		},
	}, nil
}

func (s *Service) removeTripLocation(ctx context.Context, tripId string, locationId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.find(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return err
	}

	if !canDeleteTripLocation(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this trip location")
		sp.RecordError(err)
		return err
	}

	ct, err := s.db.DeleteTripLocation(ctx, locationId)

	if err != nil {
		sp.RecordError(err)

		pgErr, ok := err.(*pgconn.PgError)

		if !ok {
			return huma.Error500InternalServerError("Failed to delete location")
		}

		return huma.Error500InternalServerError("Failed to delete location " + pgErr.Code + ": " + pgErr.Message)
	}

	if ct.RowsAffected() != 1 {
		err = huma.Error404NotFound("Location with id " + locationId + " not found")
		sp.RecordError(err)
		return err
	}

	return nil
}
