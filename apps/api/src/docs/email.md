# Email

- We are using `jordan-wright/email` package for sending emails.
- You can find the mail service code in `pkg/mail` folder.
- We are using `axllent/mailpit` for testing emails.
- Mailpit acts as an SMTP server, captures emails, and provides a Web UI (`http://localhost:8025`) for viewing emails.
- Check Docker Compose file for mailpit configuration.
- Mail service expects these environment variables to be set:
  - `SMTP_ADDR`: For development, this is the Mailpit SMTP server address.
  - `SMTP_HOST`: For development, this is the localhost.
  - `SMTP_IDENTITY`: For production usage.
  - `SMTP_PASSWORD`: For production usage.
  - `SMTP_USERNAME`: For production usage.
  - `EMAIL_FROM`: Sender email address.
  - `EMAIL_NAME`: Sender name.
- Email templates should be placed in `templates` folder.

## Sending Emails

- Create a new file in `templates` folder with the `.html` extension.
- Use other files in the same folder as a reference.
- You can use variables in the template by using `{{ .VariableName }}` syntax.
- Define a new payload struct in `pkg/mail/payload.go` file. Example:

```go
type MyNewEmailPayload struct {
  Foo string
}
```

- You must add the same variables you used in the template to the payload struct.
- You **must not** directly call the `Send` method of the mail service.
- Instead, use the task service to schedule a new task for sending the email.
- Open `pkg/tasks/process_emails.go` file.
- Add a new unique task type inside the const block. Example:

```go
const (
  //
  // Other types
  //
  TypeMyNewEmail = "email:my-new-email"
)
```

- Add a new payload struct for the task type in the same file. Example:

```go
type MyNewEmailPayload struct {
  Email string
  Foo   string
}
```

- Add a new handler function for the task type in the same file.
- Use other handlers as a reference.
- Open `pkg/tasks/tasks.go` file.
- Inside the `NewMux` function, register the handler. Example:

```go
//
// Other handlers
//
mux.HandleFunc(TypeMyNewEmail, t.HandleMyNewEmailTask)
```

- Go to the file where you want to send the email.
- You can use the `CreateAndEnqueue` method of the task service to schedule a new task for sending the email. Example:

```go
t, err = s.Tasks.CreateAndEnqueue(tasks.Job{
  Type: tasks.TypeMyNewEmail,
  Data: tasks.MyNewEmailPayload{
    Email: user.Email,
    Foo: "Foo Bar Baz",
  },
})
```

## Intercepting and Viewing E-mails

- On local environment, Mailpit will capture emails.
- You can view the emails in Mailpit Web UI.
- Go to `http://localhost:8025` in your browser.
