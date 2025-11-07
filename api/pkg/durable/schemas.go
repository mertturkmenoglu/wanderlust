package durable

type SendForgotPasswordEmailPayload struct {
	Email string
	Code  string
}
