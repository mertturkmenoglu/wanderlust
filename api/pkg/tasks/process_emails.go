package tasks

import (
	"context"
	"time"
	"wanderlust/pkg/mail"

	"github.com/hibiken/asynq"
)

const (
	TypeForgotPasswordEmail = "email:forgot-password"
	TypeWelcomeEmail        = "email:welcome"
	TypeNewLoginAlertEmail  = "email:new-login-alert"
	TypePasswordResetEmail  = "email:password-reset"
	TypeVerifyEmailEmail    = "email:verify-email"
)

type ForgotPasswordEmailPayload struct {
	Email string
	Code  string
}

type WelcomeEmailPayload struct {
	Email string
	Name  string
}

type NewLoginAlertEmailPayload struct {
	Email     string
	Location  string
	UserAgent string
}

type PasswordResetEmailPayload struct {
	Email string
	Url   string
}

type VerifyEmailEmailPayload struct {
	Email string
	Url   string
}

func (svc *TasksService) HandleEmailForgotPasswordTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[ForgotPasswordEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return svc.mailSvc.Send(mail.MailInfo{
		To:           p.Email,
		TemplatePath: "templates/forgot-password.html",
		Subject:      "Reset your password",
		Data: mail.ForgotPasswordPayload{
			Code: p.Code,
		},
	})
}

func (svc *TasksService) HandleWelcomeEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[WelcomeEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return svc.mailSvc.Send(mail.MailInfo{
		To:           p.Email,
		TemplatePath: "templates/welcome.html",
		Subject:      "Welcome to Wanderlust",
		Data: mail.WelcomePayload{
			Name: p.Name,
		},
	})
}

func (ts *TasksService) HandleNewLoginAlertEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[NewLoginAlertEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.mailSvc.Send(mail.MailInfo{
		To:           p.Email,
		TemplatePath: "templates/new-login-alert.html",
		Subject:      "New Login to Your Wanderlust Account",
		Data: mail.NewLoginAlertPayload{
			Date:      time.Now().Format("2006-01-02T15:04"),
			Location:  p.Location,
			UserAgent: p.UserAgent,
		},
	})
}

func (ts *TasksService) HandlePasswordResetEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[PasswordResetEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.mailSvc.Send(mail.MailInfo{
		To:           p.Email,
		TemplatePath: "templates/password-reset.html",
		Subject:      "Reset Your Wanderlust Password",
		Data: mail.PasswordResetPayload{
			Url: p.Url,
		},
	})
}

func (ts *TasksService) HandleVerifyEmailEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[VerifyEmailEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.mailSvc.Send(mail.MailInfo{
		To:           p.Email,
		TemplatePath: "templates/verify-email.html",
		Subject:      "Verify Your Email",
		Data: mail.VerifyEmailPayload{
			Url: p.Url,
		},
	})
}
