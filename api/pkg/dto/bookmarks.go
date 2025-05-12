package dto

import "time"

type Bookmark struct {
	ID        int32       `json:"id" example:"1234" doc:"ID of bookmark"`
	PoiID     string      `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	Poi       BookmarkPoi `json:"poi"`
	UserID    string      `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time   `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of bookmark"`
}

type BookmarkPoi struct {
	ID         string   `json:"id" example:"7323488942953598976" doc:"ID of point of interest"`
	Name       string   `json:"name" example:"The Great Wall of China" doc:"Name of point of interest"`
	AddressID  int32    `json:"addressId" example:"123456789" doc:"ID of address of point of interest"`
	Address    Address  `json:"address"`
	CategoryID int16    `json:"categoryId" example:"1" doc:"ID of category of point of interest"`
	Category   Category `json:"category"`
	FirstMedia Media    `json:"firstMedia"`
}

type CreateBookmarkInput struct {
	Body CreateBookmarkInputBody
}

type CreateBookmarkInputBody struct {
	PoiId string `json:"poiId" required:"true" example:"7323488942953598976" doc:"ID of point of interest" minLength:"1"`
}

type CreateBookmarkOutput struct {
	Body CreateBookmarkOutputBody
}

type CreateBookmarkOutputBody struct {
	ID        int32     `json:"id" example:"1234" doc:"ID of bookmark"`
	PoiID     string    `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of bookmark"`
}

type DeleteBookmarkInput struct {
	ID string `path:"id" validate:"required" doc:"ID of point of interest" example:"7323488942953598976"`
}

type GetUserBookmarksInput struct {
	PaginationQueryParams
}

type GetUserBookmarksOutput struct {
	Body GetUserBookmarksOutputBody
}

type GetUserBookmarksOutputBody struct {
	Bookmarks  []Bookmark     `json:"bookmarks"`
	Pagination PaginationInfo `json:"pagination"`
}
