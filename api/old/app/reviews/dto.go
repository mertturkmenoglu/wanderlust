package reviews

import (
	"time"
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

type GetReviewsByPoiIdResponseDto struct {
	Reviews []GetReviewByIdResponseDto `json:"reviews"`
}

type GetReviewsByUsernameResponseDto struct {
	Reviews []GetReviewByIdResponseDto `json:"reviews"`
}

type GetPoiRatingsResponseDto struct {
	Ratings    map[int8]int64 `json:"ratings"`
	TotalVotes int64          `json:"totalVotes"`
}
