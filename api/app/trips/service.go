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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create comment")
	}

	return &CreateTripCommentOutput{
		Body: CreateTripCommentOutputBody{
			Comment: TripComment{
				ID:        res.ID,
				TripID:    tripId,
				From:      TripUser{ID: userId},
				Content:   body.Content,
				CreatedAt: res.CreatedAt.Time,
			},
		},
	}, nil
}

func (s *Service) getComments(ctx context.Context, tripId string, params PaginationQueryParams) (*GetTripCommentsOutput, error) {
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

	comments := make([]TripComment, len(dbComments))

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

	return &GetTripCommentsOutput{
		Body: GetTripCommentsOutputBody{
			Comments:   comments,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) findCommentById(ctx context.Context, id string) (*TripComment, error) {
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

func (s *Service) updateComment(ctx context.Context, input *UpdateTripCommentInput) (*UpdateTripCommentOutput, error) {
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

func (s *Service) updateAmenities(ctx context.Context, tripId string, body UpdateTripAmenitiesInputBody) (*UpdateTripAmenitiesOutput, error) {
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

	return &UpdateTripAmenitiesOutput{
		Body: UpdateTripAmenitiesOutputBody{
			Amenities: trip.RequestedAmenities,
		},
	}, nil
}

func (s *Service) updateTrip(ctx context.Context, id string, body UpdateTripInputBody) (*UpdateTripOutput, error) {
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

func (s *Service) createTripLocation(ctx context.Context, tripId string, body CreateTripLocationInputBody) (*CreateTripLocationOutput, error) {
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
		ID:     uid.Flake(),
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

	return &CreateTripLocationOutput{
		Body: CreateTripLocationOutputBody{
			Location: TripPlace{
				ID:            res.ID,
				TripID:        tripId,
				ScheduledTime: res.ScheduledTime.Time,
				Description:   res.Description,
				PoiID:         res.PoiID,
				Poi:           Poi{},
			},
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
