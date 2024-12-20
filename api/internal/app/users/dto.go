package users

import (
	"time"
)

type GetUserProfileResponseDto struct {
	ID                string    `json:"id"`
	Username          string    `json:"username"`
	FullName          string    `json:"fullName"`
	IsBusinessAccount bool      `json:"isBusinessAccount"`
	IsVerified        bool      `json:"isVerified"`
	Bio               *string   `json:"bio"`
	Pronouns          *string   `json:"pronouns"`
	Website           *string   `json:"website"`
	Phone             *string   `json:"phone"`
	ProfileImage      *string   `json:"profileImage"`
	BannerImage       *string   `json:"bannerImage"`
	FollowersCount    int32     `json:"followersCount"`
	FollowingCount    int32     `json:"followingCount"`
	CreatedAt         time.Time `json:"createdAt"`
}

type UpdateUserProfileRequestDto struct {
	FullName string  `json:"fullName"`
	Bio      *string `json:"bio"`
	Pronouns *string `json:"pronouns"`
	Website  *string `json:"website"`
	Phone    *string `json:"phone"`
}

type UpdateUserProfileResponseDto = GetUserProfileResponseDto

type GetUserFollowersResponseDto struct {
	Followers []GetUserProfileResponseDto `json:"followers"`
}

type GetUserFollowingResponseDto struct {
	Following []GetUserProfileResponseDto `json:"following"`
}

type SearchUserFollowingResponseDto struct {
	Friends []GetUserProfileResponseDto `json:"friends"`
}

type GetUserActivitiesResponseDto struct {
	Activities []map[string]any `json:"activities"`
}
