package dto

import "time"

type Profile struct {
	ID                string    `json:"id" example:"564457817990234127" doc:"ID of user"`
	Username          string    `json:"username" example:"johndoe" doc:"Username of user"`
	FullName          string    `json:"fullName" example:"John Doe" doc:"Full name of user"`
	IsBusinessAccount bool      `json:"isBusinessAccount" example:"false" doc:"Is user a business account"`
	IsVerified        bool      `json:"isVerified" example:"false" doc:"Is user verified"`
	Bio               *string   `json:"bio" required:"true" example:"Lorem ipsum" doc:"Bio of user"`
	Pronouns          *string   `json:"pronouns" required:"true" example:"he/him" doc:"Pronouns of user"`
	Website           *string   `json:"website" required:"true" example:"https://example.com" doc:"Website of user"`
	Phone             *string   `json:"phone" required:"true" example:"+1234567890" doc:"Phone number of user"`
	ProfileImage      *string   `json:"profileImage" required:"true" example:"https://example.com/profile.jpg" doc:"Profile image of user"`
	BannerImage       *string   `json:"bannerImage" required:"true" example:"https://example.com/banner.jpg" doc:"Banner image of user"`
	FollowersCount    int32     `json:"followersCount" example:"100" doc:"Number of followers"`
	FollowingCount    int32     `json:"followingCount" example:"50" doc:"Number of following"`
	CreatedAt         time.Time `json:"createdAt" example:"2023-01-01T00:00:00Z" doc:"Created at time of user"`
}

type UpdateUserProfileImageInput struct {
	Type string `path:"type" enum:"profile,banner" example:"profile" doc:"Type of image" required:"true"`
	Body UpdateUserProfileImageInputBody
}

type UpdateUserProfileImageInputBody struct {
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
}

type UpdateUserProfileImageOutput struct {
	Body UpdateUserProfileImageOutputBody
}

type UpdateUserProfileImageOutputBody struct {
	URL string `json:"url" example:"https://example.com/image.jpg" doc:"URL of image upload endpoint"`
}

type GetUserProfileInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserProfileOutput struct {
	Body GetUserProfileOutputBody
}

type GetUserProfileOutputBody struct {
	Profile Profile                  `json:"profile"`
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
	Followers []Profile `json:"followers"`
}

type GetUserFollowingInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserFollowingOutput struct {
	Body GetUserFollowingOutputBody
}

type GetUserFollowingOutputBody struct {
	Following []Profile `json:"following"`
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
	Friends []Profile `json:"friends"`
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
	Pronouns *string `json:"pronouns" example:"he/him" doc:"Pronouns of the user" required:"false" minLength:"3" nullable:"true" maxLength:"255"`
	Website  *string `json:"website" example:"https://example.com" doc:"Website of the user" required:"false" nullable:"true" minLength:"3" maxLength:"255" format:"uri"`
	Phone    *string `json:"phone" example:"+1234567890" doc:"Phone number of the user" required:"false" nullable:"true" minLength:"3" maxLength:"32"`
}

type UpdateUserProfileOutput struct {
	Body UpdateUserProfileOutputBody
}

type UpdateUserProfileOutputBody struct {
	Profile Profile `json:"profile"`
}

type GetUserTopPoisInput struct {
	Username string `path:"username" validate:"required" doc:"Username of the user" example:"johndoe"`
}

type GetUserTopPoisOutput struct {
	Body GetUserTopPoisOutputBody
}

type GetUserTopPoisOutputBody struct {
	Pois []Poi `json:"pois"`
}
