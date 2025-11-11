package reviews

import "wanderlust/pkg/dto"

type GetReviewByIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of review" example:"7323488942953598976"`
}

type GetReviewByIdOutput struct {
	Body GetReviewByIdOutputBody
}

type GetReviewByIdOutputBody struct {
	Review dto.Review `json:"review"`
}

type CreateReviewInput struct {
	Body CreateReviewInputBody
}

type CreateReviewInputBody struct {
	PlaceID string `json:"placeId" example:"7323488942953598976" doc:"Place ID" minLength:"1" maxLength:"32"`
	Content string `json:"content" example:"Lorem ipsum dolor sit amet" doc:"Content of the review" minLength:"1" maxLength:"2048"`
	Rating  int16  `json:"rating" example:"1" doc:"Rating of the review" min:"1" max:"5"`
}

type CreateReviewOutput struct {
	Body CreateReviewOutputBody
}

type CreateReviewOutputBody struct {
	Review dto.Review `json:"review"`
}

type DeleteReviewInput struct {
	ID string `path:"id" validate:"required" doc:"ID of review" example:"7323488942953598976"`
}

type DeleteReviewOutput struct {
}

type GetReviewsByUsernameInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe" minLength:"1" maxLength:"32"`
	dto.PaginationQueryParams
}

type GetReviewsByUsernameOutput struct {
	Body GetReviewsByUsernameOutputBody
}

type GetReviewsByUsernameOutputBody struct {
	Reviews    []dto.Review       `json:"reviews"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type GetReviewsByPlaceIdInput struct {
	ID        string `path:"id" validate:"required" doc:"ID of place" example:"7323488942953598976"`
	SortBy    string `query:"sortBy" doc:"Sort by" example:"created_at" enum:"created_at,rating"`
	SortOrd   string `query:"sortOrd" doc:"Sort order" example:"desc" enum:"asc,desc"`
	MinRating int16  `query:"minRating" doc:"Minimum rating" example:"1" min:"1" max:"5"`
	MaxRating int16  `query:"maxRating" doc:"Maximum rating" example:"5" min:"1" max:"5"`
	dto.PaginationQueryParams
}

type GetReviewsByPlaceIdOutput struct {
	Body GetReviewsByPlaceIdOutputBody
}

type GetReviewsByPlaceIdOutputBody struct {
	Reviews    []dto.Review       `json:"reviews"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type GetRatingsByPlaceIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of place" example:"7323488942953598976"`
}

type GetRatingsByPlaceIdOutput struct {
	Body GetRatingsByPlaceIdOutputBody
}

type GetRatingsByPlaceIdOutputBody struct {
	Ratings    map[int8]int64 `json:"ratings"`
	TotalVotes int64          `json:"totalVotes"`
}

type GetReviewAssetsByPlaceIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of place" example:"7323488942953598976"`
}

type GetReviewAssetsByPlaceIdOutput struct {
	Body GetReviewAssetsByPlaceIdOutputBody
}

type GetReviewAssetsByPlaceIdOutputBody struct {
	Assets []dto.Asset `json:"assets"`
}

type UploadReviewAssetInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of draft" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	Body UploadReviewAssetInputBody
}

type UploadReviewAssetInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
}

type UploadReviewAssetOutput struct {
	Body UploadReviewAssetOutputBody
}

type UploadReviewAssetOutputBody struct {
	Review dto.Review `json:"review"`
}
