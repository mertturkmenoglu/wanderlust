package dto

import "time"

type Profile struct {
	ID                string    `json:"id" example:"564457817990234127" doc:"ID of user"`
	Username          string    `json:"username" example:"johndoe" doc:"Username of user"`
	FullName          string    `json:"fullName" example:"John Doe" doc:"Full name of user"`
	IsBusinessAccount bool      `json:"isBusinessAccount" example:"false" doc:"Is user a business account"`
	IsVerified        bool      `json:"isVerified" example:"false" doc:"Is user verified"`
	Bio               *string   `json:"bio" required:"false" example:"Lorem ipsum" doc:"Bio of user"`
	Pronouns          *string   `json:"pronouns" required:"false" example:"he/him" doc:"Pronouns of user"`
	Website           *string   `json:"website" required:"false" example:"https://example.com" doc:"Website of user"`
	Phone             *string   `json:"phone" required:"false" example:"+1234567890" doc:"Phone number of user"`
	ProfileImage      *string   `json:"profileImage" required:"false" example:"https://example.com/profile.jpg" doc:"Profile image of user"`
	BannerImage       *string   `json:"bannerImage" required:"false" example:"https://example.com/banner.jpg" doc:"Banner image of user"`
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
