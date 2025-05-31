package dto

import "time"

type Favorite struct {
	ID        int32     `json:"id" example:"1234" doc:"ID of favorite"`
	PoiID     string    `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	Poi       Poi       `json:"poi"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of favorite"`
}

type CreateFavoriteInput struct {
	Body CreateFavoriteInputBody
}

type CreateFavoriteInputBody struct {
	PoiId string `json:"poiId" required:"true" example:"7323488942953598976" doc:"ID of point of interest" minLength:"1"`
}

type CreateFavoriteOutput struct {
	Body CreateFavoriteOutputBody
}

type CreateFavoriteOutputBody struct {
	ID        int32     `json:"id" example:"1234" doc:"ID of favorite"`
	PoiID     string    `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	UserID    string    `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of favorite"`
}

type DeleteFavoriteInput struct {
	ID string `path:"id" validate:"required" doc:"ID of point of interest" example:"7323488942953598976"`
}

type GetUserFavoritesInput struct {
	PaginationQueryParams
}

type GetUserFavoritesOutput struct {
	Body GetUserFavoritesOutputBody
}

type GetUserFavoritesOutputBody struct {
	Favorites  []Favorite     `json:"favorites"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetUserFavoritesByUsernameInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
	PaginationQueryParams
}
