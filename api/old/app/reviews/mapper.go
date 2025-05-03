package reviews

import (
	common_dto "wanderlust/internal/pkg/common/dto"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapToCreateReviewResponseDto(v db.Review) CreateReviewResponseDto {
	return CreateReviewResponseDto{
		ID:        v.ID,
		PoiID:     v.PoiID,
		UserID:    v.UserID,
		Content:   v.Content,
		Rating:    v.Rating,
		CreatedAt: v.CreatedAt.Time,
		UpdatedAt: v.UpdatedAt.Time,
	}
}

func mapToGetReviewByIdResponseDto(review db.GetReviewByIdRow, media []db.ReviewMedium) GetReviewByIdResponseDto {
	mediaRes := make([]ReviewMediaDto, 0)

	for _, m := range media {
		mediaRes = append(mediaRes, ReviewMediaDto{
			ID:         m.ID,
			ReviewID:   m.ReviewID,
			Url:        m.Url,
			MediaOrder: m.MediaOrder,
		})
	}

	return GetReviewByIdResponseDto{
		ID:        review.Review.ID,
		PoiID:     review.Review.PoiID,
		UserID:    review.Review.UserID,
		Content:   review.Review.Content,
		Rating:    review.Review.Rating,
		CreatedAt: review.Review.CreatedAt.Time,
		UpdatedAt: review.Review.UpdatedAt.Time,
		Poi: ReviewPoiDto{
			ID:   review.Poi.ID,
			Name: review.Poi.Name,
		},
		User: common_dto.Profile{
			ID:                review.Profile.ID,
			Username:          review.Profile.Username,
			FullName:          review.Profile.FullName,
			IsBusinessAccount: review.Profile.IsBusinessAccount,
			IsVerified:        review.Profile.IsVerified,
			Bio:               utils.TextOrNil(review.Profile.Bio),
			Pronouns:          utils.TextOrNil(review.Profile.Pronouns),
			Website:           utils.TextOrNil(review.Profile.Website),
			Phone:             utils.TextOrNil(review.Profile.Phone),
			ProfileImage:      utils.TextOrNil(review.Profile.ProfileImage),
			BannerImage:       utils.TextOrNil(review.Profile.BannerImage),
			FollowersCount:    review.Profile.FollowersCount,
			FollowingCount:    review.Profile.FollowingCount,
			CreatedAt:         review.Profile.CreatedAt.Time,
		},
		Media: mediaRes,
	}
}

func mapToGetReviewsByPoiIdResponseDto(v []db.GetReviewsByPoiIdRow, media []db.ReviewMedium) GetReviewsByPoiIdResponseDto {
	reviews := make([]GetReviewByIdResponseDto, 0)

	for _, item := range v {
		reviewMedia := make([]ReviewMediaDto, 0)

		for _, m := range media {
			if m.ReviewID != item.Review.ID {
				continue
			}

			reviewMedia = append(reviewMedia, ReviewMediaDto{
				ID:         m.ID,
				ReviewID:   m.ReviewID,
				Url:        m.Url,
				MediaOrder: m.MediaOrder,
			})
		}

		reviews = append(reviews, GetReviewByIdResponseDto{
			ID:        item.Review.ID,
			PoiID:     item.Review.PoiID,
			UserID:    item.Review.UserID,
			Content:   item.Review.Content,
			Rating:    item.Review.Rating,
			CreatedAt: item.Review.CreatedAt.Time,
			UpdatedAt: item.Review.UpdatedAt.Time,
			Poi: ReviewPoiDto{
				ID:   item.Poi.ID,
				Name: item.Poi.Name,
			},
			User: common_dto.Profile{
				ID:                item.Profile.ID,
				Username:          item.Profile.Username,
				FullName:          item.Profile.FullName,
				IsBusinessAccount: item.Profile.IsBusinessAccount,
				IsVerified:        item.Profile.IsVerified,
				Bio:               utils.TextOrNil(item.Profile.Bio),
				Pronouns:          utils.TextOrNil(item.Profile.Pronouns),
				Website:           utils.TextOrNil(item.Profile.Website),
				Phone:             utils.TextOrNil(item.Profile.Phone),
				ProfileImage:      utils.TextOrNil(item.Profile.ProfileImage),
				BannerImage:       utils.TextOrNil(item.Profile.BannerImage),
				FollowersCount:    item.Profile.FollowersCount,
				FollowingCount:    item.Profile.FollowingCount,
				CreatedAt:         item.Profile.CreatedAt.Time,
			},
			Media: reviewMedia,
		})
	}

	return GetReviewsByPoiIdResponseDto{
		Reviews: reviews,
	}
}

func mapToGetReviewsByUsernameResponseDto(v []db.GetReviewsByUsernameRow, media []db.ReviewMedium) GetReviewsByUsernameResponseDto {
	reviews := make([]GetReviewByIdResponseDto, 0)

	for _, item := range v {
		reviewMedia := make([]ReviewMediaDto, 0)

		for _, m := range media {
			if m.ReviewID != item.Review.ID {
				continue
			}

			reviewMedia = append(reviewMedia, ReviewMediaDto{
				ID:         m.ID,
				ReviewID:   m.ReviewID,
				Url:        m.Url,
				MediaOrder: m.MediaOrder,
			})
		}

		reviews = append(reviews, GetReviewByIdResponseDto{
			ID:        item.Review.ID,
			PoiID:     item.Review.PoiID,
			UserID:    item.Review.UserID,
			Content:   item.Review.Content,
			Rating:    item.Review.Rating,
			CreatedAt: item.Review.CreatedAt.Time,
			UpdatedAt: item.Review.UpdatedAt.Time,
			Poi: ReviewPoiDto{
				ID:   item.Poi.ID,
				Name: item.Poi.Name,
			},
			User: common_dto.Profile{
				ID:                item.Profile.ID,
				Username:          item.Profile.Username,
				FullName:          item.Profile.FullName,
				IsBusinessAccount: item.Profile.IsBusinessAccount,
				IsVerified:        item.Profile.IsVerified,
				Bio:               utils.TextOrNil(item.Profile.Bio),
				Pronouns:          utils.TextOrNil(item.Profile.Pronouns),
				Website:           utils.TextOrNil(item.Profile.Website),
				Phone:             utils.TextOrNil(item.Profile.Phone),
				ProfileImage:      utils.TextOrNil(item.Profile.ProfileImage),
				BannerImage:       utils.TextOrNil(item.Profile.BannerImage),
				FollowersCount:    item.Profile.FollowersCount,
				FollowingCount:    item.Profile.FollowingCount,
				CreatedAt:         item.Profile.CreatedAt.Time,
			},
			Media: reviewMedia,
		})
	}

	return GetReviewsByUsernameResponseDto{
		Reviews: reviews,
	}
}
