package tasks

import (
	"context"
	"time"
	"wanderlust/pkg/mail"

	"github.com/hibiken/asynq"
	"github.com/minio/minio-go/v7"
)

const (
	TypeForgotPasswordEmail = "email:forgot-password"
	TypeWelcomeEmail        = "email:welcome"
	TypeNewLoginAlertEmail  = "email:new-login-alert"
	TypePasswordResetEmail  = "email:password-reset"
	TypeVerifyEmailEmail    = "email:verify-email"
	TypeDeleteDiaryMedia    = "diary:delete-media"
)

func (t *TasksService) register(mux *asynq.ServeMux) {
	mux.HandleFunc(TypeForgotPasswordEmail, t.HandleEmailForgotPasswordTask)
	mux.HandleFunc(TypeNewLoginAlertEmail, t.HandleNewLoginAlertEmailTask)
	mux.HandleFunc(TypeWelcomeEmail, t.HandleWelcomeEmailTask)
	mux.HandleFunc(TypePasswordResetEmail, t.HandlePasswordResetEmailTask)
	mux.HandleFunc(TypeVerifyEmailEmail, t.HandleVerifyEmailEmailTask)
	mux.HandleFunc(TypeDeleteDiaryMedia, t.HandleDeleteDiaryMediaTask)
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

func (ts *TasksService) HandleDeleteDiaryMediaTask(_ context.Context, t *asynq.Task) error {
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
