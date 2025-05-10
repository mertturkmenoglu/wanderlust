package diary

type ListDiaryEntriesResponseDto struct {
	Entries []DiaryEntryDto `json:"entries"`
}

type CreateDiaryEntryRequestDto struct {
	ShareWithFriends bool                          `json:"shareWithFriends" validate:"boolean"`
	Title            string                        `json:"title" validate:"required,min=1,max=128"`
	Description      string                        `json:"description" validate:"required,min=1,max=4096"`
	Date             string                        `json:"date" validate:"required,datetime=2006-01-02T15:04:05Z07:00"`
	Friends          []string                      `json:"friends" validate:"required,min=0,max=32,dive,required"`
	Locations        []CreateDiaryEntryLocationDto `json:"locations" validate:"required,min=1,max=32,dive,required"`
}

type CreateDiaryEntryLocationDto struct {
	ID          string  `json:"id" validate:"required,min=1,max=32"`
	Description *string `json:"description" validate:"omitnil,min=1,max=256"`
}

type CreateDiaryEntryResponseDto = DiaryEntryDto
