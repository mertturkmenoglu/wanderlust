package dto

import "time"

type DiaryEntry struct {
	ID               string          `json:"id" example:"7323488942953598976" doc:"The ID of the diary entry"`
	UserID           string          `json:"userId" example:"7323488942953598976" doc:"The ID of the user"`
	User             Profile         `json:"user"`
	Friends          []Profile       `json:"friends"`
	Locations        []DiaryLocation `json:"locations"`
	Media            []DiaryMedia    `json:"media"`
	Title            string          `json:"title" example:"My diary entry" doc:"The title of the diary entry"`
	Description      string          `json:"description" example:"My diary entry description" doc:"The description of the diary entry"`
	ShareWithFriends bool            `json:"shareWithFriends" example:"true" doc:"Whether the diary entry is shared with friends or not"`
	Date             time.Time       `json:"date" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry"`
	CreatedAt        time.Time       `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"The created at time of the diary entry"`
	UpdatedAt        time.Time       `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"The updated at time of the diary entry"`
}

type DiaryLocation struct {
	Poi         Poi     `json:"poi"`
	Description *string `json:"description" example:"My location description" doc:"The description of the location"`
	ListIndex   int32   `json:"listIndex" example:"1" doc:"The list index of the location"`
}

type DiaryMedia struct {
	ID           int64     `json:"id" example:"7323488942953598976" doc:"The ID of the media"`
	DiaryEntryID string    `json:"diaryEntryId" example:"7323488942953598976" doc:"The ID of the diary entry"`
	Url          string    `json:"url" example:"https://example.com/image.jpg" doc:"The URL of the media"`
	Alt          string    `json:"alt" example:"My image" doc:"The alt text of the media"`
	Caption      *string   `json:"caption" example:"My image caption" doc:"The caption of the media"`
	MediaOrder   int16     `json:"mediaOrder" example:"1" doc:"The media order of the media"`
	CreatedAt    time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"The created at time of the media"`
}

type GetDiaryEntriesInput struct {
	PaginationQueryParams
	DiaryDateFilterQueryParams
}

type DiaryDateFilterQueryParams struct {
	From *string `json:"from,omitempty" format:"date" example:"2023-01-01" doc:"Start date of the date range"`
	To   *string `json:"to,omitempty" format:"date" example:"2024-01-01" doc:"End date of the date range"`
}

type GetDiaryEntriesOutput struct {
	Body GetDiaryEntriesOutputBody
}

type GetDiaryEntriesOutputBody struct {
	Entries    []DiaryEntry   `json:"entries"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetDiaryEntryByIdInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}

type GetDiaryEntryByIdOutput struct {
	Body GetDiaryEntryByIdOutputBody
}

type GetDiaryEntryByIdOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type ChangeDiaryEntySharingInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}
