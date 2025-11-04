package trips

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

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
