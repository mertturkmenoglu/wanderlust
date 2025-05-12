package tasks

import (
	"context"
	"time"
	"wanderlust/pkg/email"

	"github.com/hibiken/asynq"
	"github.com/minio/minio-go/v7"
)

func (ts *Tasks) HandleEmailForgotPasswordTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[ForgotPasswordEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.email.SendWithTemplate(email.WithTemplateConfig{
		To:           p.Email,
		TemplatePath: "templates/forgot-password.html",
		Subject:      "Reset your password",
		Data: email.ForgotPasswordPayload{
			Code: p.Code,
		},
	})
}

func (ts *Tasks) HandleWelcomeEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[WelcomeEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.email.SendWithTemplate(email.WithTemplateConfig{
		To:           p.Email,
		TemplatePath: "templates/welcome.html",
		Subject:      "Welcome to Wanderlust",
		Data: email.WelcomePayload{
			Name: p.Name,
		},
	})
}

func (ts *Tasks) HandleNewLoginAlertEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[NewLoginAlertEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.email.SendWithTemplate(email.WithTemplateConfig{
		To:           p.Email,
		TemplatePath: "templates/new-login-alert.html",
		Subject:      "New Login to Your Wanderlust Account",
		Data: email.NewLoginAlertPayload{
			Date:      time.Now().Format("2006-01-02T15:04"),
			Location:  p.Location,
			UserAgent: p.UserAgent,
		},
	})
}

func (ts *Tasks) HandlePasswordResetEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[PasswordResetEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.email.SendWithTemplate(email.WithTemplateConfig{
		To:           p.Email,
		TemplatePath: "templates/password-reset.html",
		Subject:      "Reset Your Wanderlust Password",
		Data: email.PasswordResetPayload{
			Url: p.Url,
		},
	})
}

func (ts *Tasks) HandleVerifyEmailEmailTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[VerifyEmailEmailPayload](t.Payload())

	if err != nil {
		return err
	}

	return ts.email.SendWithTemplate(email.WithTemplateConfig{
		To:           p.Email,
		TemplatePath: "templates/verify-email.html",
		Subject:      "Verify Your Email",
		Data: email.VerifyEmailPayload{
			Url: p.Url,
		},
	})
}

func (ts *Tasks) HandleDeleteDiaryMediaTask(_ context.Context, t *asynq.Task) error {
	p, err := parse[DeleteDiaryMediaPayload](t.Payload())

	if err != nil {
		return err
	}

	const bucket = "diaries"

	for _, name := range p.ObjectNames {
		err = ts.upload.Client.RemoveObject(context.Background(), bucket, name, minio.RemoveObjectOptions{})

		if err != nil {
			return err
		}
	}

	return nil
}
