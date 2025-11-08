package places

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) list(ctx context.Context, ids []string) ([]dto.Place, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if len(ids) == 0 {
		return []dto.Place{}, nil
	}

	dbPlaces, err := r.db.FindManyPlacesPopulated(ctx, ids)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	places, err := dto.ToPlaces(dbPlaces[0])

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return places, nil
}

func (r *Repository) isFavorite(ctx context.Context, userId string, placeId string) (bool, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	isFav, err := r.db.IsPlaceFavorited(ctx, db.IsPlaceFavoritedParams{
		PlaceID: placeId,
		UserID:  userId,
	})

	if err != nil {
		return false, errors.Wrap(ErrFailedToCheckFavorite, err.Error())
	}

	return isFav, nil
}

func (r *Repository) isBookmarked(ctx context.Context, userId string, placeId string) (bool, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	isBookmarked, err := r.db.IsPlaceBookmarked(ctx, db.IsPlaceBookmarkedParams{
		PlaceID: placeId,
		UserID:  userId,
	})

	if err != nil {
		return false, errors.Wrap(ErrFailedToCheckBookmark, err.Error())
	}

	return isBookmarked, nil
}

func (r *Repository) peek(ctx context.Context) ([]dto.Place, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := r.db.FindManyPlaceIds(ctx, db.FindManyPlaceIdsParams{
		Offset: 0,
		Limit:  25,
	})

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	return r.list(ctx, ids)
}

type UpdateAddressParams = db.UpdateAddressParams

func (r *Repository) updateAddress(ctx context.Context, params UpdateAddressParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdateAddress(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateAddress, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

type UpdateInfoParams = db.UpdatePlaceInfoParams

func (r *Repository) updateInfo(ctx context.Context, params UpdateInfoParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdatePlaceInfo(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateInfo, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

func (r *Repository) updateAmenities(ctx context.Context, id string, amenities map[string]*string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdatePlaceAmenities(ctx, db.UpdatePlaceAmenitiesParams{
		ID:        id,
		Amenities: amenities,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateAmenities, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

func (r *Repository) updateHours(ctx context.Context, id string, hours map[string]*string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdatePlaceHours(ctx, db.UpdatePlaceHoursParams{
		ID:    id,
		Hours: hours,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateHours, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}
