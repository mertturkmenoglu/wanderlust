package email

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"

	jwEmail "github.com/jordan-wright/email"
	"github.com/spf13/viper"
)

type EmailService struct {
	from      string
	fromEmail string
	addr      string
	auth      smtp.Auth
}

func New() *EmailService {
	from := viper.GetString("email.name")
	fromEmail := viper.GetString("email.from")
	addr := viper.GetString("smtp.addr")
	identity := viper.GetString("smtp.identity")
	username := viper.GetString("smtp.username")
	password := viper.GetString("smtp.password")
	host := viper.GetString("smtp.host")
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