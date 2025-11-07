package trips

import (
	"context"
	"fmt"
	"time"
	"wanderlust/app/places"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pkg/errors"
)

type Service struct {
	placesService *places.Service
	repo          *Repository
}

func (s *Service) getTripById(ctx context.Context, id string) (*GetTripByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	if !canRead(trip, userId) {
		return nil, ErrNotAuthorizedToAccess
	}

	return &GetTripByIdOutput{
		Body: GetTripByIdOutputBody{
			Trip: *trip,
		},
	}, nil
}

func (s *Service) getAllTrips(ctx context.Context, params dto.PaginationQueryParams) (*GetAllTripsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trips, count, err := s.repo.listMyTrips(ctx, userId, params)

	if err != nil {
		return nil, err
	}

	return &GetAllTripsOutput{
		Body: GetAllTripsOutputBody{
			Trips:      trips,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) getMyInvites(ctx context.Context) (*GetMyTripInvitesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	invites, err := s.repo.listMyInvites(ctx, userId)

	if err != nil {
		return nil, err
	}

	return &GetMyTripInvitesOutput{
		Body: GetMyTripInvitesOutputBody{
			Invites: invites,
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateTripInputBody) (*CreateTripOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	res, err := s.repo.create(ctx, CreateParams{
		ID:                 uid.Flake(),
		OwnerID:            userId,
		Title:              body.Title,
		Description:        body.Description,
		VisibilityLevel:    body.Visibility,
		StartAt:            pgtype.Timestamptz{Time: body.StartAt, Valid: true},
		EndAt:              pgtype.Timestamptz{Time: body.EndAt, Valid: true},
		RequestedAmenities: make(pgtype.Hstore),
	})

	if err != nil {
		return nil, err
	}

	return &CreateTripOutput{
		Body: CreateTripOutputBody{
			Trip: *res,
		},
	}, nil
}

func (s *Service) getInvitesByTripId(ctx context.Context, tripId string) (*GetTripInvitesByTripIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	if !canRead(trip, userId) {
		return nil, ErrNotAuthorizedToAccess
	}

	invites, err := s.repo.listInvitesByTripId(ctx, tripId)

	if err != nil {
		return nil, err
	}

	return &GetTripInvitesByTripIdOutput{
		Body: GetTripInvitesByTripIdOutputBody{
			Invites: invites,
		},
	}, nil
}

func (s *Service) createInvite(ctx context.Context, tripId string, body CreateTripInviteInputBody) (*CreateTripInviteOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)
	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	if !canRead(trip, userId) {
		return nil, ErrNotAuthorizedToAccess
	}

	if !canCreateInvite(trip, userId) {
		return nil, ErrNotAutorizedToCreateInvite
	}

	if trip.VisibilityLevel == dto.TRIP_VISIBILITY_LEVEL_PRIVATE {
		return nil, ErrCannotInviteToPrivateTrip
	}

	sentAt := time.Now()
	expiresAt := sentAt.Add(time.Hour * 24 * 7)

	dbRes, err := s.repo.createInvite(ctx, CreateInviteParams{
		ID:     uid.Flake(),
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
		return nil, err
	}

	invites, err := s.repo.listInvitesByTripId(ctx, tripId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateInvite, err.Error())
	}

	for _, invite := range invites {
		if invite.ID == dbRes.ID {
			return &CreateTripInviteOutput{
				Body: CreateTripInviteOutputBody{
					Invite: invite,
				},
			}, nil
		}
	}

	return nil, errors.Wrap(ErrFailedToCreateInvite, "Invite not found after creation")
}

func (s *Service) getInviteDetail(ctx context.Context, tripId string, inviteId string) (*GetTripInviteDetailsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	invites, err := s.repo.listInvitesByTripId(ctx, tripId)

	if err != nil {
		return nil, err
	}

	var invite *dto.TripInvite = nil

	for _, inv := range invites {
		if inv.ID == inviteId {
			invite = &inv
			break
		}
	}

	if invite == nil {
		return nil, ErrInviteNotFound
	}

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if invite.To.ID != userId {
		return nil, ErrNotAuthorizedToAccessInvite
	}

	if invite.ExpiresAt.Before(time.Now()) {
		err = s.repo.removeInvite(ctx, inviteId)

		if err != nil {
			return nil, err
		}

		return nil, ErrInviteExpired
	}

	return &GetTripInviteDetailsOutput{
		Body: GetTripInviteDetailsOutputBody{
			InviteDetail: dto.TripInviteDetail{
				TripInvite: *invite,
				TripTitle:  trip.Title,
				StartAt:    trip.StartAt,
				EndAt:      trip.EndAt,
			},
		},
	}, nil
}

func (s *Service) acceptOrDeclineInvite(ctx context.Context, tripId string, inviteId string, action string) (*TripInviteActionOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	inviteDetail, err := s.getInviteDetail(ctx, tripId, inviteId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
	}

	userId := ctx.Value("userId").(string)

	err = s.repo.acceptOrDeclineInvite(ctx, AcceptOrDeclineInviteParams{
		UserID:   userId,
		Action:   action,
		InviteID: inviteId,
		TripID:   tripId,
		Role:     string(inviteDetail.Body.InviteDetail.Role),
	})

	if err != nil {
		return nil, err
	}

	var accepted bool = true

	if action == "decline" {
		accepted = false
	}

	return &TripInviteActionOutput{
		Body: TripInviteActionOutputBody{
			Accepted: accepted,
		},
	}, nil
}

func (s *Service) removeInvite(ctx context.Context, tripId string, inviteId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return err
	}

	if !canRemoveInvite(trip, userId) {
		return ErrNotAuthorizedToDeleteInvite
	}

	return s.repo.removeInvite(ctx, inviteId)
}

func (s *Service) removeParticipant(ctx context.Context, tripId string, participantId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return err
	}

	if !canRead(trip, userId) {
		return ErrNotAuthorizedToAccess
	}

	if !canRemoveParticipant(trip, userId, participantId) {
		return ErrNotAuthorizedToRemoveParticipant
	}

	return s.repo.removeParticipant(ctx, tripId, participantId)
}

func (s *Service) removeTrip(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, id)

	if err != nil {
		return err
	}

	if trip.OwnerID != userId {
		return ErrNotAuthorizedToDelete
	}

	return s.repo.remove(ctx, id)
}

func (s *Service) createComment(ctx context.Context, tripId string, body CreateTripCommentInputBody) (*CreateTripCommentOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	if !canCreateComment(trip, userId) {
		return nil, ErrNotAuthorizedToCreateComment
	}

	res, err := s.repo.createComment(ctx, CreateCommentParams{
		ID:      uid.Flake(),
		TripID:  tripId,
		FromID:  userId,
		Content: body.Content,
		CreatedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: true,
		},
	})

	if err != nil {
		return nil, err
	}

	return &CreateTripCommentOutput{
		Body: CreateTripCommentOutputBody{
			Comment: *res,
		},
	}, nil
}

func (s *Service) getComments(ctx context.Context, tripId string, params dto.PaginationQueryParams) (*GetTripCommentsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	if !canRead(trip, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this trip")
		sp.RecordError(err)
		return nil, ErrNotAuthorizedToAccess
	}

	if !canReadComment(trip, userId) {
		return nil, ErrNotAuthorizedToAccessComments
	}

	comments, count, err := s.repo.listComments(ctx, tripId, params)

	if err != nil {
		return nil, err
	}

	return &GetTripCommentsOutput{
		Body: GetTripCommentsOutputBody{
			Comments:   comments,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) updateComment(ctx context.Context, input *UpdateTripCommentInput) (*UpdateTripCommentOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	comment, err := s.repo.getComment(ctx, input.CommentID)

	if err != nil {
		return nil, err
	}

	if !canUpdateComment(comment, userId) {
		return nil, ErrNotAuthorizedToUpdateComment
	}

	err = s.repo.updateComment(ctx, UpdateCommentParams{
		ID:      input.CommentID,
		TripID:  input.TripID,
		Content: input.Body.Content,
	})

	if err != nil {
		return nil, err
	}

	updatedComment, err := s.repo.getComment(ctx, input.CommentID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUpdateComment, err.Error())
	}

	return &UpdateTripCommentOutput{
		Body: UpdateTripCommentOutputBody{
			Comment: *updatedComment,
		},
	}, nil
}

func (s *Service) removeComment(ctx context.Context, tripId string, commentId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	comment, err := s.repo.getComment(ctx, commentId)

	if err != nil {
		return err
	}

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !canDeleteComment(trip, comment, userId) {
		return ErrNotAuthorizedToDeleteComment
	}

	return s.repo.removeComment(ctx, commentId)
}

func (s *Service) updateTrip(ctx context.Context, id string, body UpdateTripInputBody) (*UpdateTripOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	if !canUpdateTrip(trip, userId) {
		return nil, ErrNotAuthorizedToUpdate
	}

	err = s.repo.update(ctx, trip, body)

	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (s *Service) createTripPlace(ctx context.Context, tripId string, body CreateTripPlaceInputBody) (*CreateTripPlaceOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	trip, err := s.repo.get(ctx, tripId)

	if err != nil {
		return nil, err
	}

	if !canCreateLocation(trip, userId) {
		return nil, ErrNotAuthorizedToCreatePlace
	}

	if body.ScheduledTime.Before(trip.StartAt) {
		return nil, ErrInvalidScheduledTimeBeforeTripStart
	}

	if body.ScheduledTime.After(trip.EndAt) {
		return nil, ErrInvalidScheduledTimeAfterTripEnd
	}

	var description = ""

	if body.Description != nil {
		description = *body.Description
	}

	res, err := s.repo.createTripPlace(ctx, CreateTripPlaceParams{
		ID:      uid.Flake(),
		TripID:  tripId,
		PlaceID: body.PlaceID,
		ScheduledTime: pgtype.Timestamptz{
			Time:  body.ScheduledTime,
			Valid: true,
		},
		Description: description,
	})

	if err != nil {
		return nil, err
	}

	return &CreateTripPlaceOutput{
		Body: CreateTripPlaceOutputBody{
			Place: *res,
		},
	}, nil
}

func (s *Service) findTripLocationById(ctx context.Context, id string) (*TripPlace, error) {
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

	return &TripPlace{
		ID:            location.TripLocation.ID,
		TripID:        location.TripLocation.TripID,
		ScheduledTime: location.TripLocation.ScheduledTime.Time,
		Description:   location.TripLocation.Description,
		PoiID:         location.TripLocation.PoiID,
		Poi:           poi,
	}, nil
}

func (s *Service) updateTripLocation(ctx context.Context, input *UpdateTripLocationInput) (*UpdateTripLocationOutput, error) {
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

	return &UpdateTripLocationOutput{
		Body: UpdateTripLocationOutputBody{
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
