package tasks

type (
	ForgotPasswordEmailPayload struct {
		Email string
		Code  string
	}

	WelcomeEmailPayload struct {
		Email string
		Name  string
	}

	NewLoginAlertEmailPayload struct {
		Email     string
		Location  string
		UserAgent string
	}

	PasswordResetEmailPayload struct {
		Email string
		Url   string
	}

	VerifyEmailEmailPayload struct {
		Email string
		Url   string
	}

	DeleteDiaryMediaPayload struct {
		ObjectNames []string
	}
)
