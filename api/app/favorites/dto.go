package favorites

import (
	"time"
	"wanderlust/pkg/dto"
)

type CreateFavoriteInput struct {
	Body CreateFavoriteInputBody
}

type CreateFavoriteInputBody struct {
	PlaceID string `json:"placeId" required:"true" example:"7323488942953598976" doc:"Place ID" minLength:"1"`
}

type CreateFavoriteOutput struct {
	Body CreateFavoriteOutputBody
}

type CreateFavoriteOutputBody struct {
	ID        int64     `json:"id" example:"1234" doc:"ID of favorite"`
	PlaceID   string    `json:"placeId" example:"7323488942953598976" doc:"Place ID"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of favorite"`
}

type DeleteFavoriteInput struct {
	ID string `path:"id" validate:"required" doc:"Place ID" example:"7323488942953598976"`
}

type DeleteFavoriteOutput struct {
}

type GetCurrentUserFavoritesInput struct {
	dto.PaginationQueryParams
}

type GetCurrentUserFavoritesOutput struct {
	Body GetCurrentUserFavoritesOutputBody
}

type GetCurrentUserFavoritesOutputBody struct {
	Favorites  []dto.Favorite     `json:"favorites"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type GetUserFavoritesByUsernameInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
	dto.PaginationQueryParams
}

type GetUserFavoritesByUsernameOutput struct {
	Body GetUserFavoritesByUsernameOutputBody
}

type GetUserFavoritesByUsernameOutputBody struct {
	Favorites  []dto.Favorite     `json:"favorites"`
	Pagination dto.PaginationInfo `json:"pagination"`
}
