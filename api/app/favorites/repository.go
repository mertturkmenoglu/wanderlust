package favorites

import (
	"context"
	"wanderlust/app/pois"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
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

func (r *Repository) create(ctx context.Context, userId string, poiId string) (*db.Favorite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrTransactionFailed, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	res, err := qtx.CreateFavorite(ctx, db.CreateFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, errors.Wrap(ErrAlreadyFavorited, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	err = qtx.IncrementFavorites(ctx, poiId)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, errors.Wrap(ErrTransactionFailed, err.Error())
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, userId string, poiId string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrTransactionFailed, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.DeleteFavoriteByPoiId(ctx, db.DeleteFavoriteByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	err = qtx.DecrementFavorites(ctx, poiId)

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

	res, err := r.db.GetFavoritesByUserId(ctx, db.GetFavoritesByUserIdParams{
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

	count, err := r.db.CountUserFavorites(ctx, userId)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) populateWithPois(ctx context.Context, favorites []db.Favorite, poiIds []string) ([]dto.Favorite, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	pois, err := r.poiService.FindMany(ctx, poiIds)

	if err != nil {
		return nil, err
	}

	favoritesDtos := make([]dto.Favorite, len(favorites))

	for i, v := range favorites {
		var poi *dto.Poi = nil

		for _, p := range pois {
			if p.ID == v.PoiID {
				poi = &p
				break
			}
		}

		if poi == nil {
			return nil, errors.Wrap(ErrFailedToList, "Failed to find POI for favorite")
		}

		favoritesDtos[i] = mapper.ToFavorite(v, *poi)
	}

	return favoritesDtos, nil
}

func (r *Repository) getUserByUsername(ctx context.Context, username string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.GetUserByUsername(ctx, username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return &user, nil
}
