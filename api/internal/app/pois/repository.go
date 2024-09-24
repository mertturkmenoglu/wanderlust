package pois

import (
	"context"
	"errors"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5"
)

func (r *repository) peekPois() ([]db.Poi, error) {
	return r.db.Queries.PeekPois(context.Background())
}

func (r *repository) getPoiById(id string) (GetPoiByIdDao, error) {
	poi, err := r.db.Queries.GetPoiById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetPoiByIdDao{}, ErrNotFound
		}

		return GetPoiByIdDao{}, err
	}

	media, err := r.db.Queries.GetPoiMedia(context.Background(), id)

	if err != nil {
		return GetPoiByIdDao{}, err
	}

	amenities, err := r.db.Queries.GetPoiAmenities(context.Background(), id)

	if err != nil {
		return GetPoiByIdDao{}, err
	}

	return GetPoiByIdDao{
		poi:       poi.Poi,
		address:   poi.Address,
		city:      poi.City,
		category:  poi.Category,
		media:     media,
		amenities: amenities,
	}, nil
}
