package diary

import "time"

type CreateDiaryEntryRequestDto struct {
	ShareWithFriends bool                          `json:"shareWithFriends" validate:"boolean"`
	Title            string                        `json:"title" validate:"required,min=1,max=128"`
	Description      string                        `json:"description" validate:"required,min=1,max=128"`
	Date             string                        `json:"date" validate:"required,datetime=2006-01-02T15:04:05Z07:00"`
	Friends          []string                      `json:"friends" validate:"required,min=1,max=32,dive,required"`
	Locations        []CreateDiaryEntryLocationDto `json:"locations" validate:"required,min=1,max=32,dive,required"`
}

type CreateDiaryEntryLocationDto struct {
	ID          string  `json:"id" validate:"required,min=1,max=32"`
	Description *string `json:"description" validate:"min=1,max=256"`
}

type CreateDiaryEntryResponseDto struct {
	ID               string    `json:"id"`
	UserID           string    `json:"userId"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	ShareWithFriends bool      `json:"shareWithFriends"`
	Date             time.Time `json:"date"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type GetDiaryEntryByIdResponseDto struct {
}
