package dto

import (
	"net/http"
	"time"
)

type LoginInput struct {
	Body LoginInputBody
}

type LoginInputBody struct {
	Email    string `json:"email" example:"john@example.com" doc:"Email of the user" minLength:"1" maxLength:"128" format:"email" required:"true"`
	Password string `json:"password" example:"password123" doc:"Password of the user" minLength:"1" maxLength:"128" required:"true"`
}

type LoginOutput struct {
	Authorization string `header:"Authorization"`
	Body          LoginOutputBody
}

type LoginOutputBody struct {
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" doc:"JWT token for the user"`
}

type RegisterInput struct {
	Body RegisterInputBody
}

type RegisterInputBody struct {
	FullName string `json:"fullName" example:"John Doe" doc:"Full name of the user" minLength:"3" maxLength:"128" required:"true"`
	Email    string `json:"email" example:"john@example.com" doc:"Email of the user" minLength:"1" maxLength:"128" format:"email" required:"true"`
	Username string `json:"username" example:"johndoe" doc:"Username of the user" minLength:"4" maxLength:"32" required:"true"`
	Password string `json:"password" example:"password123" doc:"Password of the user" minLength:"6" maxLength:"128" required:"true"`
}

type RegisterOutput struct {
	Body RegisterOutputBody
}

type RegisterOutputBody struct {
	ID        string    `json:"id" example:"564457817990234127" doc:"ID of the user"`
	Email     string    `json:"email" example:"john@example.com" doc:"Email of the user"`
	Username  string    `json:"username" example:"johndoe" doc:"Username of the user"`
	FullName  string    `json:"fullName" example:"John Doe" doc:"Full name of the user"`
	CreatedAt time.Time `json:"createdAt" example:"2023-01-01T00:00:00Z" doc:"Creation date of the user"`
	UpdatedAt time.Time `json:"updatedAt" example:"2023-01-01T00:00:00Z" doc:"Last update date of the user"`
}

type GetMeOutput struct {
	Body GetMeOutputBody
}

type GetMeOutputBody struct {
	ID                    string    `json:"id" example:"564457817990234127" doc:"ID of the user"`
	Email                 string    `json:"email" example:"john@example.com" doc:"Email of the user"`
	Username              string    `json:"username" example:"johndoe" doc:"Username of the user"`
	FullName              string    `json:"fullName" example:"John Doe" doc:"Full name of the user"`
	GoogleID              *string   `json:"googleId" example:"1234567890" doc:"Google ID of the user" required:"false"`
	FacebookID            *string   `json:"facebookId" example:"1234567890" doc:"Facebook ID of the user" required:"false"`
	IsEmailVerified       bool      `json:"isEmailVerified" example:"false" doc:"Is the email verified"`
	IsOnboardingCompleted bool      `json:"isOnboardingCompleted" example:"false" doc:"Is the onboarding completed"`
	IsActive              bool      `json:"isActive" example:"true" doc:"Is the user active"`
	IsBusinessAccount     bool      `json:"isBusinessAccount" example:"false" doc:"Is the user a business account"`
	IsVerified            bool      `json:"isVerified" example:"false" doc:"Is the user verified"`
	Role                  string    `json:"role" example:"user" doc:"Role of the user"`
	Bio                   *string   `json:"bio" example:"Lorem ipsum" doc:"Bio of the user" required:"false"`
	Pronouns              *string   `json:"pronouns" example:"he/him" doc:"Pronouns of the user" required:"false"`
	Website               *string   `json:"website" example:"https://example.com" doc:"Website of the user" required:"false"`
	Phone                 *string   `json:"phone" example:"+1234567890" doc:"Phone number of the user" required:"false"`
	ProfileImage          *string   `json:"profileImage" example:"https://example.com/profile.jpg" doc:"Profile image of the user" required:"false"`
	BannerImage           *string   `json:"bannerImage" example:"https://example.com/banner.jpg" doc:"Banner image of the user" required:"false"`
	FollowersCount        int32     `json:"followersCount" example:"100" doc:"Number of followers"`
	FollowingCount        int32     `json:"followingCount" example:"50" doc:"Number of following"`
	LastLogin             time.Time `json:"lastLogin" example:"2023-01-01T00:00:00Z" doc:"Last login date of the user"`
	CreatedAt             time.Time `json:"createdAt" example:"2023-01-01T00:00:00Z" doc:"Creation date of the user"`
	UpdatedAt             time.Time `json:"updatedAt" example:"2023-01-01T00:00:00Z" doc:"Last update date of the user"`
}

type OAuthInput struct {
	Provider string `path:"provider" enum:"google,facebook" example:"google" doc:"The OAuth provider"`
}

type OAuthOutput struct {
	Status int
	Url    string `header:"Location"`
	Cookie string `header:"Set-Cookie"`
}

type OAuthCallbackInput struct {
	Provider    string `path:"provider" enum:"google,facebook" example:"google" doc:"The OAuth provider"`
	Code        string `query:"code" doc:"Authorization code received from the OAuth provider"`
	QueryState  string `query:"state" doc:"State of the OAuth request"`
	CookieState string `cookie:"state" doc:"State of the OAuth request"`
}

type OAuthCallbackOutput struct {
	SetCookie http.Cookie `header:"Set-Cookie"`
	Status    int
	Url       string `header:"Location"`
}

type SendVerificationEmailInput struct {
	Body SendVerificationEmailInputBody
}

type SendVerificationEmailInputBody struct {
	Email string `json:"email" example:"john@example.com" doc:"Email of the user" minLength:"1" maxLength:"128" format:"email" required:"true"`
}

type VerifyEmailInput struct {
	Code string `query:"code" doc:"Verification code" required:"true" example:"123456" minLength:"6" maxLength:"6"`
}

type SendForgotPasswordEmailInput struct {
	Body SendForgotPasswordEmailInputBody
}

type SendForgotPasswordEmailInputBody struct {
	Email string `json:"email" example:"john@example.com" doc:"Email of the user" minLength:"1" maxLength:"128" format:"email" required:"true"`
}

type ResetPasswordInput struct {
	Body ResetPasswordInputBody
}

type ResetPasswordInputBody struct {
	Email       string `json:"email" example:"john@example.com" doc:"Email of the user" minLength:"1" maxLength:"128" format:"email" required:"true"`
	Code        string `json:"code" example:"123456" doc:"Verification code" minLength:"6" maxLength:"6" required:"true"`
	NewPassword string `json:"newPassword" example:"newpassword123" doc:"New password of the user" minLength:"6" maxLength:"128" required:"true"`
}
