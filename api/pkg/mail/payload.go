package mail

type (
	ForgotPasswordPayload struct {
		Code string
	}

	WelcomePayload struct {
		Name string
	}

	NewLoginAlertPayload struct {
		Date      string
		Location  string
		UserAgent string
	}

	PasswordResetPayload struct {
		Url string
	}

	VerifyEmailPayload struct {
		Url string
	}
)
