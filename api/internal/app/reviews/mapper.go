package reviews

import "wanderlust/internal/pkg/db"

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
