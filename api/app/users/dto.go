package users

import "wanderlust/pkg/dto"

type UpdateUserImageInput struct {
	Type string `path:"type" enum:"profile,banner" example:"profile" doc:"Type of image" required:"true"`
	Body UpdateUserImageInputBody
}

type UpdateUserImageInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
}

type UpdateUserImageOutput struct {
	Body UpdateUserImageOutputBody
}

type UpdateUserImageOutputBody struct {
	URL string `json:"url" example:"https://example.com/image.jpg" doc:"URL of the image"`
}

type GetUserProfileInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserProfileOutput struct {
	Body GetUserProfileOutputBody
}

type GetUserProfileOutputBody struct {
	Profile dto.Profile              `json:"profile"`
	Meta    GetUserProfileOutputMeta `json:"meta"`
}

type GetUserProfileOutputMeta struct {
	IsFollowing bool `json:"isFollowing"`
}

type GetUserFollowersInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserFollowersOutput struct {
	Body GetUserFollowersOutputBody
}

type GetUserFollowersOutputBody struct {
	Followers []dto.Profile `json:"followers"`
}

type GetUserFollowingInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserFollowingOutput struct {
	Body GetUserFollowingOutputBody
}

type GetUserFollowingOutputBody struct {
	Following []dto.Profile `json:"following"`
}

type GetUserTopPlacesInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserTopPlacesOutput struct {
	Body GetUserTopPlacesOutputBody
}

type GetUserTopPlacesOutputBody struct {
	Places []dto.Place `json:"places"`
}

type UpdateUserTopPlacesInput struct {
	Body UpdateUserTopPlacesInputBody
}

type UpdateUserTopPlacesInputBody struct {
	PlaceIds []string `json:"placeIds" doc:"IDs of places" required:"true" uniqueItems:"true" minItems:"0" maxItems:"4"`
}

type UpdateUserTopPlacesOutput struct {
	Body UpdateUserTopPlacesOutputBody
}

type UpdateUserTopPlacesOutputBody struct {
	Places []dto.Place `json:"places"`
}

type GetUserActivitiesInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserActivitiesOutput struct {
	Body GetUserActivitiesOutputBody
}

type GetUserActivitiesOutputBody struct {
	Activities []map[string]any `json:"activities"`
}

type SearchUserFollowingInput struct {
	Username string `query:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type SearchUserFollowingOutput struct {
	Body SearchUserFollowingOutputBody
}

type SearchUserFollowingOutputBody struct {
	Friends []dto.Profile `json:"friends"`
}

type MakeUserVerifiedInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type MakeUserVerifiedOutput struct {
	Body MakeUserVerifiedOutputBody
}

type MakeUserVerifiedOutputBody struct {
	IsVerified bool `json:"isVerified"`
}

type FollowUserInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type FollowUserOutput struct {
	Body FollowUserOutputBody
}

type FollowUserOutputBody struct {
	IsFollowing bool `json:"isFollowing"`
}

type UpdateUserProfileInput struct {
	Body UpdateUserProfileInputBody
}

type UpdateUserProfileInputBody struct {
	FullName string  `json:"fullName" example:"John Doe" doc:"Full name of the user" required:"true" minLength:"3" maxLength:"128"`
	Bio      *string `json:"bio" example:"Lorem ipsum dolor sit amet" doc:"Bio of the user" required:"false" nullable:"true" minLength:"3" maxLength:"255"`
}

type UpdateUserProfileOutput struct {
	Body UpdateUserProfileOutputBody
}

type UpdateUserProfileOutputBody struct {
	Profile dto.Profile `json:"profile"`
}
