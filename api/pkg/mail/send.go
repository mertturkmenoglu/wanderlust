package mail

import (
	"bytes"
	"fmt"
	"html/template"

	"github.com/jordan-wright/email"
)

type MailInfo struct {
	TemplatePath string
	Data         any
	To           string
	Subject      string
}

func (svc *MailService) Send(info MailInfo) error {
	email := email.NewEmail()
	email.From = fmt.Sprintf("%s <%s>", svc.from, svc.fromEmail)
	email.To = []string{info.To}
	email.Subject = info.Subject
	body, err := readHtmlBody(info)

	if err != nil {
		return err
	}

	email.HTML = body

	return email.Send(svc.addr, svc.auth)
}

func readHtmlBody(info MailInfo) ([]byte, error) {
	t, err := template.ParseFiles(info.TemplatePath)

	if err != nil {
		return nil, err
	}

	var body bytes.Buffer

	err = t.Execute(&body, info.Data)

	if err != nil {
		return nil, err
	}

	return body.Bytes(), nil
}
