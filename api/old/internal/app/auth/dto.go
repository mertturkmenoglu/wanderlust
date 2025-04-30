package auth

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
