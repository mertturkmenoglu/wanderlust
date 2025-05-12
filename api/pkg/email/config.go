package email

type WithTemplateConfig struct {
	TemplatePath string
	Data         any
	To           string
	Subject      string
}
