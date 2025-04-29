package common_dto

import "time"

type Profile struct {
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
