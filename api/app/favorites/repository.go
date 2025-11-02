package favorites

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db         *db.Queries
	pool       *pgxpool.Pool
	poiService *pois.Service
}

func (r *Repository) create(ctx context.Context, userId string, placeId string) (*db.Favorite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrTransactionFailed, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	res, err := qtx.CreateFavorite(ctx, db.CreateFavoriteParams{
		PlaceID: placeId,
		UserID:  userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, errors.Wrap(ErrAlreadyFavorited, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	_, err = qtx.IncrementPlaceTotalFavorites(ctx, placeId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrTransactionFailed, err.Error())
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, userId string, placeId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrTransactionFailed, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	_, err = qtx.RemoveFavoriteByPlaceIdAndUserId(ctx, db.RemoveFavoriteByPlaceIdAndUserIdParams{
		PlaceID: placeId,
		UserID:  userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	_, err = qtx.DecrementPlaceTotalFavorites(ctx, placeId)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrTransactionFailed, err.Error())
	}

	return nil
}

func (r *Repository) listByUserId(ctx context.Context, userId string, offset int32, limit int32) ([]db.Favorite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyFavoritesByUserId(ctx, db.FindManyFavoritesByUserIdParams{
		UserID: userId,
		Offset: offset,
		Limit:  limit,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return res, nil
}

func (r *Repository) countByUserId(ctx context.Context, userId string) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	count, err := r.db.CountFavoritesByUserId(ctx, userId)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) populateWithPois(ctx context.Context, favorites []db.Favorite, placeIds []string) ([]dto.Favorite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	places, err := r.poiService.FindMany(ctx, placeIds)

	if err != nil {
		return nil, err
	}

	favoritesDtos := make([]dto.Favorite, len(favorites))

	for i, v := range favorites {
		var place *dto.Place = nil

		for _, p := range places {
			if p.ID == v.PlaceID {
				place = &p
				break
			}
		}

		if place == nil {
			return nil, errors.Wrap(ErrFailedToList, "Failed to find Place for favorite")
		}

		favoritesDtos[i] = dto.ToFavorite(v, *place)
	}

	return favoritesDtos, nil
}

func (r *Repository) getUserByUsername(ctx context.Context, username string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.FindUserByUsername(ctx, username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return &user, nil
}
