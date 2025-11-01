package bookmarks

import (
	"time"
	"wanderlust/pkg/dto"
)

type CreateBookmarkInput struct {
	Body CreateBookmarkInputBody
}

type CreateBookmarkInputBody struct {
	PlaceID string `json:"placeId" required:"true" example:"7323488942953598976" doc:"Place ID" minLength:"1"`
}

type CreateBookmarkOutput struct {
	Body CreateBookmarkOutputBody
}

type CreateBookmarkOutputBody struct {
	ID        int64     `json:"id" example:"1234" doc:"ID of bookmark"`
	PlaceID   string    `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of bookmark"`
}

type DeleteBookmarkInput struct {
	PlaceID string `path:"id" validate:"required" doc:"Place ID" example:"7323488942953598976"`
}

type DeleteBookmarkOutput struct {
}

type GetUserBookmarksInput struct {
	dto.PaginationQueryParams
}

type GetUserBookmarksOutput struct {
	Body GetUserBookmarksOutputBody
}

type GetUserBookmarksOutputBody struct {
	Bookmarks  []dto.Bookmark     `json:"bookmarks"`
	Pagination dto.PaginationInfo `json:"pagination"`
}
