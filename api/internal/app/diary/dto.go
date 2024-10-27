package diary

type CreateDiaryEntryRequestDto struct {
	ShareWithFriends bool                          `json:"shareWithFriends" validate:"boolean"`
	Title            string                        `json:"title" validate:"required,min=1,max=128"`
	Description      string                        `json:"description" validate:"required,min=1,max=128"`
	Date             string                        `json:"date" validate:"required,datetime"`
	Friends          []string                      `json:"friends" validate:"required,dive,required"`
	Locations        []CreateDiaryEntryLocationDto `json:"locations" validate:"required,dive,required"`
}

type CreateDiaryEntryLocationDto struct {
	ID          string  `json:"id" validate:"required,min=1,max=32"`
	Description *string `json:"description" validate:"min=1,max=256"`
	ListIndex   int32   `json:"listIndex" validate:"min=1,max=32"`
}

type CreateDiaryEntryResponseDto struct{}
