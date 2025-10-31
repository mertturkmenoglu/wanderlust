package durable

type DeleteDiaryMediaPayload struct {
	ObjectNames []string
}

type SendForgotPasswordEmailPayload struct {
	Email string
	Code  string
}
