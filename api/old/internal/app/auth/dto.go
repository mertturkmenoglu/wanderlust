package auth

import "time"

type LoginRequestDto struct {
	Email    string `json:"email" validate:"required,email" `
	Password string `json:"password" validate:"required"`
}

type RegisterRequestDto struct {
	FullName string `json:"fullName" validate:"required,min=3,max=128"`
	Email    string `json:"email" validate:"required,email,max=128"`
	Username string `json:"username" validate:"required,min=4,max=32"`
	Password string `json:"password" validate:"required,min=6,max=128"`
}

type GetMeResponseDto struct {
	ID                    string    `json:"id"`
	Email                 string    `json:"email"`
	Username              string    `json:"username"`
	FullName              string    `json:"fullName"`
	GoogleID              *string   `json:"googleId"`
	FacebookID            *string   `json:"facebookId"`
	IsEmailVerified       bool      `json:"isEmailVerified"`
	IsOnboardingCompleted bool      `json:"isOnboardingCompleted"`
	IsActive              bool      `json:"isActive"`
	IsBusinessAccount     bool      `json:"isBusinessAccount"`
	IsVerified            bool      `json:"isVerified"`
	Role                  string    `json:"role"`
	Bio                   *string   `json:"bio"`
	Pronouns              *string   `json:"pronouns"`
	Website               *string   `json:"website"`
	Phone                 *string   `json:"phone"`
	ProfileImage          *string   `json:"profileImage"`
	BannerImage           *string   `json:"bannerImage"`
	FollowersCount        int32     `json:"followersCount"`
	FollowingCount        int32     `json:"followingCount"`
	LastLogin             time.Time `json:"lastLogin"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}

type SendVerificationEmailRequestDto struct {
	Email string `json:"email"`
}

type SendForgotPasswordEmailRequestDto struct {
	Email string `json:"email"`
}

type ResetPasswordRequestDto struct {
	Email       string `json:"email"`
	Code        string `json:"code"`
	NewPassword string `json:"newPassword"`
}
