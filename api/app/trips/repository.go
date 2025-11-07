package trips

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) list(ctx context.Context, ids []string) ([]dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyTripsByIdsPopulated(ctx, ids)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	trips := make([]dto.Trip, len(res))

	for i, item := range res {
		mapped, err := dto.ToTrip(item)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToList, err.Error())
		}

		trips[i] = mapped
	}

	return trips, nil
}

func (r *Repository) get(ctx context.Context, id string) (*dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.list(ctx, []string{id})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGet, err.Error())
	}

	if len(res) != 1 {
		return nil, ErrNotFound
	}

	return &res[0], nil
}

func (r *Repository) listMyTrips(ctx context.Context, userId string, params dto.PaginationQueryParams) ([]dto.Trip, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	rows, err := r.db.FindManyTripsByOwnerIdOrParticipantId(ctx, db.FindManyTripsByOwnerIdOrParticipantIdParams{
		OwnerID: userId,
		Offset:  int32(pagination.GetOffset(params)),
		Limit:   int32(params.PageSize),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	ids := make([]string, len(rows))

	for i, row := range rows {
		ids[i] = row.ID
	}

	trips, err := r.list(ctx, ids)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	count, err := r.db.CountTripsByOwnerIdOrParticipantId(ctx, userId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return trips, count, nil
}

func (r *Repository) listMyInvites(ctx context.Context, userId string) ([]dto.TripInvite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbInvites, err := r.db.FindManyTripInvitesByToUserId(ctx, userId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListInvites, err.Error())
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := dto.ToTripInviteFromInvitesByUserIdRow(dbInvite)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToListInvites, err.Error())
		}

		invites[i] = res
	}

	return invites, nil
}

type CreateParams = db.CreateTripParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*dto.Trip, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateTrip(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	invite, err := r.get(ctx, res.ID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return invite, nil
}

func (r *Repository) listInvitesByTripId(ctx context.Context, tripId string) ([]dto.TripInvite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbInvites, err := r.db.FindManyTripInvitesByTripId(ctx, tripId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToListInvites, err.Error())
	}

	invites := make([]dto.TripInvite, len(dbInvites))

	for i, dbInvite := range dbInvites {
		res, err := dto.ToTripInviteFromInvitesByTripIdRow(dbInvite)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToListInvites, err.Error())
		}

		invites[i] = res
	}

	return invites, nil
}

type CreateInviteParams = db.CreateTripInviteParams

func (r *Repository) createInvite(ctx context.Context, params CreateInviteParams) (*db.TripInvite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateTripInvite(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateInvite, err.Error())
	}

	return &res, nil
}

func (r *Repository) removeInvite(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveTripInviteById(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteInvite, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrInviteNotFound
	}

	return nil
}

type AcceptOrDeclineInviteParams struct {
	UserID   string
	Action   string
	InviteID string
	TripID   string
	Role     string
}

func (r *Repository) acceptOrDeclineInvite(ctx context.Context, params AcceptOrDeclineInviteParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	switch params.Action {
	case "accept":
		{
			tag, err := qtx.RemoveTripInviteById(ctx, params.InviteID)

			if err != nil {
				return errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
			}

			if tag.RowsAffected() == 0 {
				return ErrInviteNotFound
			}

			_, err = qtx.CreateTripParticipant(ctx, db.CreateTripParticipantParams{
				ID:     uid.Flake(),
				UserID: params.UserID,
				TripID: params.TripID,
				Role:   params.Role,
			})

			if err != nil {
				return errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
			}
		}
	case "decline":
		{
			tag, err := qtx.RemoveTripInviteById(ctx, params.InviteID)

			if err != nil {
				return errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
			}

			if tag.RowsAffected() == 0 {
				return ErrInviteNotFound
			}
		}
	default:
		return ErrInvalidInviteAction
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToAcceptOrDeclineInvite, err.Error())
	}

	return nil
}

func (r *Repository) removeParticipant(ctx context.Context, tripId string, participantId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveTripParticipantByTripIdAndUserId(ctx, db.RemoveTripParticipantByTripIdAndUserIdParams{
		TripID: tripId,
		UserID: participantId,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToRemoveparticipant, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrParticipantNotFound
	}

	return nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveTripById(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

type CreateCommentParams = db.CreateTripCommentParams

func (r *Repository) createComment(ctx context.Context, params CreateCommentParams) (*dto.TripComment, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateTripComment(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreateComment, err.Error())
	}

	return &dto.TripComment{
		ID:     res.ID,
		TripID: res.TripID,
		From: dto.TripUser{
			ID: res.FromID,
		},
		Content:   res.Content,
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (r *Repository) listComments(ctx context.Context, tripId string, params dto.PaginationQueryParams) ([]dto.TripComment, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbComments, err := r.db.FindManyTripCommentsByTripId(ctx, db.FindManyTripCommentsByTripIdParams{
		TripID: tripId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToCreateComment, err.Error())
	}

	comments := make([]dto.TripComment, len(dbComments))

	for i, dbComment := range dbComments {
		res, err := dto.ToTripComment(dbComment)

		if err != nil {
			return nil, 0, errors.Wrap(ErrFailedToListComments, err.Error())
		}

		comments[i] = res
	}

	count, err := r.db.CountTripCommentsByTripId(ctx, tripId)

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToListComments, err.Error())
	}

	return comments, count, nil
}

func (r *Repository) getComment(ctx context.Context, id string) (*dto.TripComment, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindTripCommentById(ctx, id)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetComment, err.Error())
	}

	comment, err := dto.ToTripCommentFromCommentByIdRow(res)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetComment, err.Error())
	}

	trip, err := r.get(ctx, comment.TripID)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToGetComment, err.Error())
	}

	userId := ctx.Value("userId").(string)

	if !canRead(trip, userId) {
		return nil, ErrNotAuthorizedToAccess
	}

	if !canReadComment(trip, userId) {
		return nil, ErrNotAuthorizedToAccessComments
	}

	return &comment, nil
}

type UpdateCommentParams = db.UpdateTripCommentParams

func (r *Repository) updateComment(ctx context.Context, params UpdateCommentParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdateTripComment(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateComment, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrCommentNotFound
	}

	return nil
}

func (r *Repository) removeComment(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveTripCommentById(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteComment, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrCommentNotFound
	}

	return nil
}

func (r *Repository) update(ctx context.Context, trip *dto.Trip, data UpdateTripInputBody) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	var isDateChanged = false

	if !data.StartAt.Equal(trip.StartAt) {
		isDateChanged = true
	}

	if !data.EndAt.Equal(trip.EndAt) {
		isDateChanged = true
	}

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	tag, err := qtx.UpdateTrip(ctx, db.UpdateTripParams{
		ID:              trip.ID,
		Title:           data.Title,
		Description:     data.Description,
		VisibilityLevel: data.VisibilityLevel,
		StartAt: pgtype.Timestamptz{
			Time:  data.StartAt,
			Valid: true,
		},
		EndAt: pgtype.Timestamptz{
			Time:  data.EndAt,
			Valid: true,
		},
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	updateResult, err := r.get(ctx, trip.ID)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	if isDateChanged {
		_, err = qtx.MoveDanglingTripPlaces(ctx, db.MoveDanglingTripPlacesParams{
			TripID: trip.ID,
			ScheduledTime: pgtype.Timestamptz{
				Time:  updateResult.StartAt,
				Valid: true,
			},
			ScheduledTime_2: pgtype.Timestamptz{
				Time:  updateResult.StartAt,
				Valid: true,
			},
			ScheduledTime_3: pgtype.Timestamptz{
				Time:  updateResult.EndAt,
				Valid: true,
			},
		})

		if err != nil {
			return errors.Wrap(ErrFailedToUpdate, err.Error())
		}
	}

	if updateResult.VisibilityLevel == dto.TRIP_VISIBILITY_LEVEL_PRIVATE {
		_, err = qtx.RemoveTripParticipantsByTripId(ctx, trip.ID)

		if err != nil {
			return errors.Wrap(ErrFailedToUpdate, err.Error())
		}

		_, err = qtx.RemoveTripCommentsByTripId(ctx, trip.ID)

		if err != nil {
			return errors.Wrap(ErrFailedToUpdate, err.Error())
		}

		_, err = qtx.RemoveTripInvitesByTripId(ctx, trip.ID)

		if err != nil {
			return errors.Wrap(ErrFailedToUpdate, err.Error())
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	return nil
}

type CreateTripPlaceParams = db.CreateTripPlaceParams

func (r *Repository) createTripPlace(ctx context.Context, params CreateTripPlaceParams) (*dto.TripPlace, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateTripPlace(ctx, params)

	if err != nil {
		var pgErr *pgconn.PgError

		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case db.FOREIGN_KEY_VIOLATION:
				return nil, errors.Wrap(ErrFailedToCreatePlace, "Place not found")
			case db.UNIQUE_VIOLATION:
				return nil, errors.Wrap(ErrFailedToCreatePlace, "Place already exists in trip")
			}
		}

		return nil, errors.Wrap(ErrFailedToCreatePlace, err.Error())
	}

	return &dto.TripPlace{
		ID:            res.ID,
		TripID:        res.TripID,
		ScheduledTime: res.ScheduledTime.Time,
		Description:   res.Description,
		PlaceID:       res.PlaceID,
		Place:         dto.Place{},
	}, nil
}
