package email

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
	"wanderlust/pkg/cfg"

	jwEmail "github.com/jordan-wright/email"
)

type EmailService struct {
	from      string
	fromEmail string
	addr      string
	auth      smtp.Auth
}

func New() *EmailService {
	var (
		from      = cfg.Get(cfg.EMAIL_NAME)
		fromEmail = cfg.Get(cfg.EMAIL_FROM)
		addr      = cfg.Get(cfg.SMTP_ADDR)
		identity  = cfg.Get(cfg.SMTP_IDENTITY)
		username  = cfg.Get(cfg.SMTP_USERNAME)
		password  = cfg.Get(cfg.SMTP_PASSWORD)
		host      = cfg.Get(cfg.SMTP_HOST)
	)

	auth := smtp.PlainAuth(identity, username, password, host)

	return &EmailService{
		from:      from,
		fromEmail: fromEmail,
		addr:      addr,
		auth:      auth,
	}
}

func (e *EmailService) Send(to string, subject string, text string) error {
	jw := e.initEmail(to, subject)
	jw.Text = []byte(text)

	return jw.Send(e.addr, e.auth)
}

func (e *EmailService) SendWithTemplate(cfg WithTemplateConfig) error {
	jw := e.initEmail(cfg.To, cfg.Subject)
	body, err := getHtmlBody(cfg)

	if err != nil {
		return err
	}

	jw.HTML = body

	return jw.Send(e.addr, e.auth)
}

func (e *EmailService) initEmail(to string, subject string) *jwEmail.Email {
	jw := jwEmail.NewEmail()
	jw.From = fmt.Sprintf("%s <%s>", e.from, e.fromEmail)
	jw.To = []string{to}
	jw.Subject = subject
	return jw
}

func getHtmlBody(templateConfig WithTemplateConfig) ([]byte, error) {
	t, err := template.ParseFiles(templateConfig.TemplatePath)

	if err != nil {
		return nil, err
	}

	var body bytes.Buffer

	err = t.Execute(&body, templateConfig.Data)

	if err != nil {
		return nil, err
	}

	return body.Bytes(), nil
}
