package dto

import "time"

type Review struct {
	ID        string        `json:"id" example:"7323488942953598976" doc:"ID of review"`
	PoiID     string        `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	UserID    string        `json:"userId" example:"7323488942953598976" doc:"ID of user"`
	Content   string        `json:"content" example:"Lorem ipsum dolor sit amet" doc:"Content of the review"`
	Rating    int16         `json:"rating" example:"1" doc:"Rating of the review"`
	CreatedAt time.Time     `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of review"`
	UpdatedAt time.Time     `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of review"`
	Poi       Poi           `json:"poi"`
	User      Profile       `json:"user"`
	Images    []ReviewImage `json:"images"`
}

type ReviewPoi struct {
	ID   string `json:"id" example:"7323488942953598976" doc:"ID of point of interest"`
	Name string `json:"name" example:"The Great Wall of China" doc:"Name of point of interest"`
}

type ReviewImage struct {
	ID       int64  `json:"id" example:"1234" doc:"ID of media of review"`
	ReviewID string `json:"reviewId" example:"7323488942953598976" doc:"ID of review"`
	Url      string `json:"url" example:"https://example.com/media.jpg" doc:"URL of media of review"`
	Index    int16  `json:"index" example:"1" doc:"Media order of media of review"`
}

type GetReviewByIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of review" example:"7323488942953598976"`
}

type GetReviewByIdOutput struct {
	Body GetReviewByIdOutputBody
}

type GetReviewByIdOutputBody struct {
	Review Review `json:"review"`
}

type CreateReviewInput struct {
	Body CreateReviewInputBody
}

type CreateReviewInputBody struct {
	PoiID   string `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest" minLength:"1" maxLength:"32"`
	Content string `json:"content" example:"Lorem ipsum dolor sit amet" doc:"Content of the review" minLength:"5" maxLength:"2048"`
	Rating  int16  `json:"rating" example:"1" doc:"Rating of the review" min:"1" max:"5"`
}

type CreateReviewOutput struct {
	Body CreateReviewOutputBody
}

type CreateReviewOutputBody struct {
	Review Review `json:"review"`
}

type DeleteReviewInput struct {
	ID string `path:"id" validate:"required" doc:"ID of review" example:"7323488942953598976"`
}

type GetReviewsByUsernameInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe" minLength:"1" maxLength:"32"`
	PaginationQueryParams
}

type GetReviewsByUsernameOutput struct {
	Body GetReviewsByUsernameOutputBody
}

type GetReviewsByUsernameOutputBody struct {
	Reviews    []Review       `json:"reviews"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetReviewsByPoiIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of point of interest" example:"7323488942953598976"`
	PaginationQueryParams
}

type GetReviewsByPoiIdOutput struct {
	Body GetReviewsByPoiIdOutputBody
}

type GetReviewsByPoiIdOutputBody struct {
	Reviews    []Review       `json:"reviews"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetRatingsByPoiIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of point of interest" example:"7323488942953598976"`
}

type GetRatingsByPoiIdOutput struct {
	Body GetRatingsByPoiIdOutputBody
}

type GetRatingsByPoiIdOutputBody struct {
	Ratings    map[int8]int64 `json:"ratings"`
	TotalVotes int64          `json:"totalVotes"`
}

type UploadReviewMediaInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of draft" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	Body UploadReviewMediaInputBody
}

type UploadReviewMediaInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
	Size     int32  `json:"size" example:"1024" doc:"Size of media of point of interest" required:"true"`
}

type UploadReviewMediaOutput struct {
	Body UploadReviewMediaOutputBody
}

type UploadReviewMediaOutputBody struct {
	Review Review `json:"review"`
}
