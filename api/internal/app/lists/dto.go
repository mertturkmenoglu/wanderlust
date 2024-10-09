package lists

import "time"

type CreateListRequestDto struct {
	Name     string `json:"name" validate:"required,min=1,max=128"`
	IsPublic bool   `json:"isPublic" validate:"required"`
}

type CreateListResponseDto struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	UserID    string    `json:"userId"`
	IsPublic  bool      `json:"isPublic"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
