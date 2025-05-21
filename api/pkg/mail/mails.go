package mail

import (
	"net/smtp"
	"wanderlust/pkg/cfg"
)

type MailService struct {
	from      string
	fromEmail string
	addr      string
	auth      smtp.Auth
}

func New() *MailService {
	var (
		from      = cfg.Env.EmailName
		fromEmail = cfg.Env.EmailFrom
		addr      = cfg.Env.SMTPAddr
		identity  = cfg.Env.SMTPIdentity
		username  = cfg.Env.SMTPUsername
		password  = cfg.Env.SMTPPassword
		host      = cfg.Env.SMTPHost
	)

	auth := smtp.PlainAuth(identity, username, password, host)

	return &MailService{
		from:      from,
		fromEmail: fromEmail,
		addr:      addr,
		auth:      auth,
	}
}
