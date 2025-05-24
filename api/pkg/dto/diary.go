package dto

import (
	"time"

	"github.com/danielgtaylor/huma/v2"
)

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
	From string `query:"from,omitempty" example:"2023-01-01" doc:"Start date of the date range" required:"false"`
	To   string `query:"to,omitempty" example:"2024-01-01" doc:"End date of the date range" required:"false"`
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

type CreateDiaryEntryInput struct {
	Body CreateDiaryEntryInputBody
}

type CreateDiaryEntryInputBody struct {
	Title string    `json:"title" required:"true" example:"My diary entry" doc:"The title of the diary entry" minLength:"1" maxLength:"128"`
	Date  time.Time `json:"date" required:"true" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry" format:"date-time"`
}

func (body *CreateDiaryEntryInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if body.Date.After(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "Date must be in the past",
			Location: prefix.With("date"),
			Value:    body.Date,
		}}
	}

	return nil
}

type CreateDiaryEntryLocation struct {
	ID          string  `json:"id" required:"true" example:"7323488942953598976" doc:"The ID of the point of interest"`
	Description *string `json:"description" example:"My location description" doc:"The description of the location" required:"false" minLength:"1" maxLength:"256"`
}

type CreateDiaryEntryOutput struct {
	Body CreateDiaryEntryOutputBody
}

type CreateDiaryEntryOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type DeleteDiaryEntryInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}

type UploadDiaryMediaInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	Body UploadDiaryMediaInputBody
}

type UploadDiaryMediaInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
	Size     int32  `json:"size" example:"1024" doc:"Size of media of point of interest" required:"true"`
}

type UploadDiaryMediaOutput struct {
	Body UploadDiaryMediaOutputBody
}

type UploadDiaryMediaOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type DeleteDiaryMediaInput struct {
	ID      string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	MediaID int64  `path:"mediaId" example:"123" doc:"ID of media"`
}

type UpdateDiaryMediaInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	Body UpdateDiaryMediaInputBody
}

type UpdateDiaryMediaInputBody struct {
	Ids []int64 `json:"ids" doc:"IDs of the media" required:"true" minItems:"0" maxItems:"32" uniqueItems:"true"`
}

type UpdateDiaryMediaOutput struct {
	Body UpdateDiaryMediaOutputBody
}

type UpdateDiaryMediaOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type UpdateDiaryEntryInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryEntryInputBody
}

type UpdateDiaryEntryInputBody struct {
	Title            string    `json:"title" example:"My diary entry" doc:"The title of the diary entry" required:"true" minLength:"1" maxLength:"128"`
	Description      string    `json:"description" example:"My diary entry description" doc:"The description of the diary entry" required:"false" minLength:"0" maxLength:"4096"`
	Date             time.Time `json:"date" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry" required:"true" format:"date-time"`
	ShareWithFriends bool      `json:"shareWithFriends" example:"true" doc:"Whether the diary entry is shared with friends or not" required:"true"`
}

func (body *UpdateDiaryEntryInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if body.Date.After(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "Date must be in the past",
			Location: prefix.With("date"),
			Value:    body.Date,
		}}
	}

	return nil
}

type UpdateDiaryEntryOutput struct {
	Body UpdateDiaryEntryOutputBody
}

type UpdateDiaryEntryOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type UpdateDiaryEntryFriendsInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryEntryFriendsInputBody
}

type UpdateDiaryEntryFriendsInputBody struct {
	Friends []string `json:"friends" doc:"IDs of the friends" required:"true" minItems:"0" maxItems:"32" uniqueItems:"true"`
}

type UpdateDiaryEntryFriendsOutput struct {
	Body UpdateDiaryEntryFriendsOutputBody
}

type UpdateDiaryEntryFriendsOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}

type UpdateDiaryEntryLocationsInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryEntryLocationsInputBody
}

type UpdateDiaryEntryLocationsInputBody struct {
	Locations []UpdateDiaryEntryLocationItem `json:"locations" doc:"IDs of the locations" required:"true" minItems:"0" maxItems:"32"`
}

func (body *UpdateDiaryEntryLocationsInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	ids := make(map[string]bool)

	// Check if the POI IDs are unique
	for _, location := range body.Locations {
		poiId := location.PoiID
		_, has := ids[poiId]

		if has {
			return []error{&huma.ErrorDetail{
				Message:  "Duplicate point of interest ID",
				Location: prefix.With("locations"),
				Value:    poiId,
			}}
		}
	}

	return nil
}

type UpdateDiaryEntryLocationItem struct {
	PoiID       string  `json:"poiId" doc:"ID of the point of interest" required:"true" minLength:"1" maxLength:"32"`
	Description *string `json:"description" doc:"Description of the location" required:"false" `
}

type UpdateDiaryEntryLocationsOutput struct {
	Body UpdateDiaryEntryLocationsOutputBody
}

type UpdateDiaryEntryLocationsOutputBody struct {
	Entry DiaryEntry `json:"entry"`
}
