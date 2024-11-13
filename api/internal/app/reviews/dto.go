package reviews

import (
	"time"
	common_dto "wanderlust/internal/pkg/common/dto"
)

type CreateReviewRequestDto struct {
	PoiID   string `json:"poiId" validate:"required,min=1,max=32"`
	Content string `json:"content" validate:"required,min=5,max=2048"`
	Rating  int16  `json:"rating" validate:"required,min=1,max=5"`
}

type CreateReviewResponseDto struct {
	ID        string    `json:"id"`
	PoiID     string    `json:"poiId"`
	UserID    string    `json:"userId"`
	Content   string    `json:"content"`
	Rating    int16     `json:"rating"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type GetReviewByIdResponseDto struct {
	ID        string             `json:"id"`
	PoiID     string             `json:"poiId"`
	UserID    string             `json:"userId"`
	Content   string             `json:"content"`
	Rating    int16              `json:"rating"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt"`
	Poi       ReviewPoiDto       `json:"poi"`
	User      common_dto.Profile `json:"user"`
	Media     []ReviewMediaDto   `json:"media"`
}

type ReviewPoiDto struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ReviewMediaDto struct {
	ID         int64  `json:"id"`
	ReviewID   string `json:"reviewId"`
	Url        string `json:"url"`
	MediaOrder int16  `json:"mediaOrder"`
}

type GetReviewsByPoiIdResponseDto struct {
	Reviews []GetReviewByIdResponseDto `json:"reviews"`
}

type GetReviewsByUsernameResponseDto struct {
	Reviews []GetReviewByIdResponseDto `json:"reviews"`
}
