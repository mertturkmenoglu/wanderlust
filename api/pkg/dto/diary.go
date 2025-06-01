package dto

import (
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type Diary struct {
	ID               string          `json:"id" example:"7323488942953598976" doc:"The ID of the diary entry"`
	UserID           string          `json:"userId" example:"7323488942953598976" doc:"The ID of the user"`
	Owner            DiaryUser       `json:"user"`
	Friends          []DiaryUser     `json:"friends"`
	Locations        []DiaryLocation `json:"locations"`
	Images           []DiaryImage    `json:"images"`
	Title            string          `json:"title" example:"My diary entry" doc:"The title of the diary entry"`
	Description      string          `json:"description" example:"My diary entry description" doc:"The description of the diary entry"`
	ShareWithFriends bool            `json:"shareWithFriends" example:"true" doc:"Whether the diary entry is shared with friends or not"`
	Date             time.Time       `json:"date" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry"`
	CreatedAt        time.Time       `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"The created at time of the diary entry"`
	UpdatedAt        time.Time       `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"The updated at time of the diary entry"`
}

type DiaryUser struct {
	ID           string  `json:"id" example:"7323488942953598976" doc:"User ID"`
	FullName     string  `json:"fullName" example:"John Doe" doc:"User full name"`
	Username     string  `json:"username" example:"johndoe" doc:"Username"`
	ProfileImage *string `json:"profileImage" example:"http://example.com/image.png" doc:"Profile image URL of the user"`
}

type DiaryLocation struct {
	PoiId       string  `json:"poiId" example:"7323488942953598976" doc:"Point of Interest ID"`
	Poi         Poi     `json:"poi"`
	Description *string `json:"description" example:"My location description" doc:"The description of the location"`
	Index       int16   `json:"index" example:"1" doc:"The list index of the location"`
}

type DiaryImage struct {
	ID        int64     `json:"id" example:"7323488942953598976" doc:"The ID of the media"`
	DiaryID   string    `json:"diaryId" example:"7323488942953598976" doc:"The ID of the diary entry"`
	Url       string    `json:"url" example:"https://example.com/image.jpg" doc:"The URL of the media"`
	Index     int16     `json:"index" example:"1" doc:"The media order of the media"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"The created at time of the media"`
}

type GetDiariesInput struct {
	PaginationQueryParams
	DiaryDateFilterQueryParams
}

type DiaryDateFilterQueryParams struct {
	From string `query:"from,omitempty" example:"2023-01-01" doc:"Start date of the date range" required:"false"`
	To   string `query:"to,omitempty" example:"2024-01-01" doc:"End date of the date range" required:"false"`
}

type GetDiariesOutput struct {
	Body GetDiariesOutputBody
}

type GetDiariesOutputBody struct {
	Diaries    []Diary        `json:"diaries"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetDiaryByIdInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}

type GetDiaryByIdOutput struct {
	Body GetDiaryByIdOutputBody
}

type GetDiaryByIdOutputBody struct {
	Diary Diary `json:"diary"`
}

type ChangeDiarySharingInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}

type CreateDiaryInput struct {
	Body CreateDiaryInputBody
}

type CreateDiaryInputBody struct {
	Title string    `json:"title" required:"true" example:"My diary entry" doc:"The title of the diary entry" minLength:"1" maxLength:"128"`
	Date  time.Time `json:"date" required:"true" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry" format:"date-time"`
}

func (body *CreateDiaryInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if body.Date.After(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "Date must be in the past",
			Location: prefix.With("date"),
			Value:    body.Date,
		}}
	}

	return nil
}

type CreateDiaryLocation struct {
	ID          string  `json:"id" required:"true" example:"7323488942953598976" doc:"The ID of the point of interest"`
	Description *string `json:"description" example:"My location description" doc:"The description of the location" required:"false" minLength:"1" maxLength:"256"`
}

type CreateDiaryOutput struct {
	Body CreateDiaryOutputBody
}

type CreateDiaryOutputBody struct {
	Diary Diary `json:"diary"`
}

type DeleteDiaryInput struct {
	ID string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
}

type UploadDiaryImageInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	Body UploadDiaryImageInputBody
}

type UploadDiaryImageInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
	Size     int32  `json:"size" example:"1024" doc:"Size of media of point of interest" required:"true"`
}

type UploadDiaryImageOutput struct {
	Body UploadDiaryImageOutputBody
}

type UploadDiaryImageOutputBody struct {
	Diary Diary `json:"diary"`
}

type DeleteDiaryImageInput struct {
	ID      string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	ImageID int64  `path:"imageId" example:"123" doc:"ID of media"`
}

type UpdateDiaryImageInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of diary entry"`
	Body UpdateDiaryImageInputBody
}

type UpdateDiaryImageInputBody struct {
	Ids []int64 `json:"ids" doc:"IDs of the images" required:"true" minItems:"0" maxItems:"32" uniqueItems:"true"`
}

type UpdateDiaryImageOutput struct {
	Body UpdateDiaryImageOutputBody
}

type UpdateDiaryImageOutputBody struct {
	Diary Diary `json:"diary"`
}

type UpdateDiaryInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryInputBody
}

type UpdateDiaryInputBody struct {
	Title            string    `json:"title" example:"My diary entry" doc:"The title of the diary entry" required:"true" minLength:"1" maxLength:"128"`
	Description      string    `json:"description" example:"My diary entry description" doc:"The description of the diary entry" required:"false" minLength:"0" maxLength:"4096"`
	Date             time.Time `json:"date" example:"2023-05-01T00:00:00Z" doc:"The date of the diary entry" required:"true" format:"date-time"`
	ShareWithFriends bool      `json:"shareWithFriends" example:"true" doc:"Whether the diary entry is shared with friends or not" required:"true"`
}

func (body *UpdateDiaryInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if body.Date.After(time.Now()) {
		return []error{&huma.ErrorDetail{
			Message:  "Date must be in the past",
			Location: prefix.With("date"),
			Value:    body.Date,
		}}
	}

	return nil
}

type UpdateDiaryOutput struct {
	Body UpdateDiaryOutputBody
}

type UpdateDiaryOutputBody struct {
	Diary Diary `json:"diary"`
}

type UpdateDiaryFriendsInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryFriendsInputBody
}

type UpdateDiaryFriendsInputBody struct {
	Friends []string `json:"friends" doc:"IDs of the friends" required:"true" minItems:"0" maxItems:"32" uniqueItems:"true"`
}

type UpdateDiaryFriendsOutput struct {
	Body UpdateDiaryFriendsOutputBody
}

type UpdateDiaryFriendsOutputBody struct {
	Diary Diary `json:"diary"`
}

type UpdateDiaryLocationsInput struct {
	ID   string `path:"id" example:"7323488942953598976" doc:"ID of the diary entry"`
	Body UpdateDiaryLocationsInputBody
}

type UpdateDiaryLocationsInputBody struct {
	Locations []UpdateDiaryLocationItem `json:"locations" doc:"IDs of the locations" required:"true" minItems:"0" maxItems:"32"`
}

func (body *UpdateDiaryLocationsInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
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

type UpdateDiaryLocationItem struct {
	PoiID       string  `json:"poiId" doc:"ID of the point of interest" required:"true" minLength:"1" maxLength:"32"`
	Description *string `json:"description" doc:"Description of the location" required:"false" `
}

type UpdateDiaryLocationsOutput struct {
	Body UpdateDiaryLocationsOutputBody
}

type UpdateDiaryLocationsOutputBody struct {
	Diary Diary `json:"diary"`
}
