package users

import "time"

// GetUserProfileResponseDto godoc
//
// @Description Get user profile response dto
type GetUserProfileResponseDto struct {
	ID                string    `json:"id" example:"528696135489945615" validate:"required"`
	Username          string    `json:"username" example:"johndoe" validate:"required"`
	FullName          string    `json:"fullName" example:"John Doe" validate:"required"`
	IsBusinessAccount bool      `json:"isBusinessAccount" example:"true" validate:"required"`
	IsVerified        bool      `json:"isVerified" example:"true" validate:"required"`
	Gender            *string   `json:"gender" example:"male" validate:"optional"`
	Bio               *string   `json:"bio" example:"I'm a software engineer" validate:"optional"`
	Pronouns          *string   `json:"pronouns" example:"he/him" validate:"optional"`
	Website           *string   `json:"website" example:"https://example.com" validate:"optional"`
	Phone             *string   `json:"phone" example:"+1234567890" validate:"optional"`
	ProfileImage      *string   `json:"profileImage" example:"https://example.com/image.jpg" validate:"optional"`
	BannerImage       *string   `json:"bannerImage" example:"https://example.com/image.jpg" validate:"optional"`
	FollowersCount    int32     `json:"followersCount" example:"100" validate:"required"`
	FollowingCount    int32     `json:"followingCount" example:"100" validate:"required"`
	CreatedAt         time.Time `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
} //@name UsersGetUserProfileResponseDto
