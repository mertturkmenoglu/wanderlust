package auth

import "time"

// LoginRequestDto godoc
//
// @Description Login request dto
type LoginRequestDto struct {
	Email    string `json:"email" validate:"required,email" example:"johndoe@example.com"`
	Password string `json:"password" validate:"required" example:"password123" minLength:"6" maxLength:"128" format:"password"`
} //@name AuthLoginRequestDto

// RegisterRequestDto godoc
//
// @Description Register request dto
type RegisterRequestDto struct {
	FullName string `json:"fullName" validate:"required,min=3,max=128" example:"John Doe" minLength:"3" maxLength:"128"`
	Email    string `json:"email" validate:"required,email,max=128" example:"johndoe@example.com" minLength:"3" maxLength:"128"`
	Username string `json:"username" validate:"required,min=4,max=32" example:"johndoe" minLength:"4" maxLength:"32"`
	Password string `json:"password" validate:"required,min=6,max=128" example:"password123" minLength:"6" maxLength:"128" format:"password"`
} //@name AuthRegisterRequestDto

// GetMeResponseDto godoc
//
// @Description Get me response dto
type GetMeResponseDto struct {
	ID                string    `json:"id" example:"528696135489945615" validate:"required"`
	Email             string    `json:"email" example:"johndoe@example.com" validate:"required"`
	Username          string    `json:"username" example:"johndoe" validate:"required"`
	FullName          string    `json:"fullName" example:"John Doe" validate:"required"`
	GoogleID          *string   `json:"googleId" example:"10887502189381205719451" validate:"optional"`
	FacebookID        *string   `json:"facebookId" example:"2391004269112809" validate:"optional"`
	IsEmailVerified   bool      `json:"isEmailVerified" example:"true" validate:"required"`
	IsActive          bool      `json:"isActive" example:"true" validate:"required"`
	IsBusinessAccount bool      `json:"isBusinessAccount" example:"true" validate:"required"`
	IsVerified        bool      `json:"isVerified" example:"true" validate:"required"`
	Role              string    `json:"role" example:"user" validate:"required"`
	Gender            *string   `json:"gender" example:"male" validate:"optional"`
	Bio               *string   `json:"bio" example:"I'm a software engineer" validate:"optional"`
	Pronouns          *string   `json:"pronouns" example:"he/him" validate:"optional"`
	Website           *string   `json:"website" example:"https://example.com" validate:"optional"`
	Phone             *string   `json:"phone" example:"+1234567890" validate:"optional"`
	ProfileImage      *string   `json:"profileImage" example:"https://example.com/image.jpg" validate:"optional"`
	BannerImage       *string   `json:"bannerImage" example:"https://example.com/image.jpg" validate:"optional"`
	FollowersCount    int32     `json:"followersCount" example:"100" validate:"required"`
	FollowingCount    int32     `json:"followingCount" example:"100" validate:"required"`
	LastLogin         time.Time `json:"lastLogin" example:"2024-08-26T10:24:13.508676+03:00" validate:"required"`
	CreatedAt         time.Time `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
	UpdatedAt         time.Time `json:"updatedAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
} //@name AuthGetMeResponseDto

// SendVerificationEmailRequestDto godoc
//
// @Description Send verification email request dto
type SendVerificationEmailRequestDto struct {
	Email string `json:"email" validate:"required,email" example:"johndoe@example.com"`
} //@name AuthSendVerificationEmailRequestDto

// SendForgotPasswordEmailRequestDto godoc
//
// @Description Send forgot password email request dto
type SendForgotPasswordEmailRequestDto struct {
	Email string `json:"email" validate:"required,email" example:"johndoe@example.com"`
} //@name AuthSendForgotPasswordEmailRequestDto

// ResetPasswordRequestDto godoc
//
// @Description Reset password request dto
type ResetPasswordRequestDto struct {
	Email       string `json:"email" validate:"required,email" example:"johndoe@example.com"`
	Code        string `json:"code" validate:"required" example:"123456"`
	NewPassword string `json:"newPassword" validate:"required,min=6,max=128" example:"password123" minLength:"6" maxLength:"128" format:"password"`
} //@name AuthResetPasswordRequestDto
