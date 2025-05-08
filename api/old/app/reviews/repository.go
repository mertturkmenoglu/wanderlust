package reviews

import (
	"context"
	"wanderlust/internal/pkg/db"
)

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
