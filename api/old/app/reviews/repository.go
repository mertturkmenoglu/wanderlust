package reviews

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/pagination"
)

func (r *repository) getReviewMedia(id string) ([]db.ReviewMedium, error) {
	return r.di.Db.Queries.GetReviewMedia(context.Background(), id)
}

func (r *repository) getReviewsByPoiId(id string, params pagination.Params) ([]db.GetReviewsByPoiIdRow, error) {
	return r.di.Db.Queries.GetReviewsByPoiId(context.Background(), db.GetReviewsByPoiIdParams{
		PoiID:  id,
		Offset: int32(params.Offset),
		Limit:  int32(params.PageSize),
	})
}

func (r *repository) countReviewsByPoiId(id string) (int64, error) {
	return r.di.Db.Queries.CountReviewsByPoiId(context.Background(), id)
}

func (r *repository) getReviewMediaByReviewIds(ids []string) ([]db.ReviewMedium, error) {
	return r.di.Db.Queries.GetReviewMediaByReviewIds(context.Background(), ids)
}

func (r *repository) addMedia(id string, url string) error {
	lastMediaOrder, err := r.di.Db.Queries.GetLastMediaOrderOfReview(context.Background(), id)

	if err != nil {
		return err
	}

	ord, ok := lastMediaOrder.(int32)

	if !ok {
		return ErrMediaOrder
	}

	order := int16(ord) + 1

	_, err = r.di.Db.Queries.CreateReviewMedia(context.Background(), db.CreateReviewMediaParams{
		ReviewID:   id,
		Url:        url,
		MediaOrder: order,
	})

	return err
}

func (r *repository) getPoiRatings(id string) ([]db.GetPoiRatingsRow, error) {
	return r.di.Db.Queries.GetPoiRatings(context.Background(), id)
}
