package mapper

import (
	"encoding/json"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToReviews(dbReviews []db.GetReviewsByIdsRow, pois []dto.Poi) ([]dto.Review, error) {
	reviews := make([]dto.Review, len(dbReviews))

	for i, v := range dbReviews {
		r, err := ToReview(v, pois)

		if err != nil {
			return nil, err
		}

		reviews[i] = r
	}

	return reviews, nil
}

func ToReview(dbReview db.GetReviewsByIdsRow, pois []dto.Poi) (dto.Review, error) {
	poi := pois[0]

	for _, v := range pois {
		if v.ID == dbReview.Review.PoiID {
			poi = v
			break
		}
	}

	var images []dto.ReviewImage

	if len(dbReview.Images) > 0 {
		err := json.Unmarshal(dbReview.Images, &images)

		if err != nil {
			return dto.Review{}, err
		}
	}

	return dto.Review{
		ID:        dbReview.Review.ID,
		PoiID:     dbReview.Review.PoiID,
		UserID:    dbReview.Review.UserID,
		Content:   dbReview.Review.Content,
		Rating:    dbReview.Review.Rating,
		Poi:       poi,
		Images:    images,
		User:      ToProfile(dbReview.Profile),
		CreatedAt: dbReview.Review.CreatedAt.Time,
		UpdatedAt: dbReview.Review.UpdatedAt.Time,
	}, nil
}
