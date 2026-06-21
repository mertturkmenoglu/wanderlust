# Email

- We are using the `react-email` for templating and `nodemailer` package for sending emails.
- You can find the mail related codes in `packages/email` folder.
- We are using `axllent/mailpit` for testing emails.
- Mailpit acts as an SMTP server, captures emails, and provides a Web UI (`http://localhost:8025`) for viewing emails.
- Check Docker Compose file for mailpit configuration.
- Mail service expects these config variables to be set (config.json):
  - `email.from`: Sender email address.
  - `email.host`: SMTP server host. For development, use `localhost`.
  - `email.port`: SMTP server port. For development, use `1025`.
  - `email.ssl`: SMTP server SSL flag. For development, use `false`.
- Email templates should be placed in `packages/email/emails` directory.
- We highly recommend reading React Email documentation: https://react.email/docs/introduction

## Sending Emails

- Create a new email template in `packages/email/emails` directory.
- Use other files in the same directory as a reference.
- Add PreviewProps if necessary.

- You **must not** directly call the `sendMail` method of the mail client.
- Instead, use the jobs service to schedule a new task for sending the email.
- Open `packages/jobs/src/email/index.tsx` file.
- Add a new entry to the schemas object. Example:

```typescript
const schemas = z.object({
  // ...
  // ...
  'send-foo': z.object({
    email: z.string(),
    foo: z.string(),
    bar: z.string(),
    baz: z.string(),
  }),
});
```

- Inside the worker function, add a new case to handle the new email event. Example:

```typescript
// ...
case 'send-foo': {
	const data = job.data as Schemas['send-foo'];
	const html = await render(<FooEmail foo={data.foo} bar={data.bar} baz={data.baz} />);

	await email.sendMail({
		from: cfg.email.from,
		to: data.email,
		subject: 'Foo Email Subject',
		html: html,
	});

	break;
}
```

- To send an email, use the jobs service:

```typescript
await jobs.email.queue.add('send-foo', {
  email: 'foo@bar.com',
  foo: 'Foo Bar Baz',
  bar: 'Bar Baz Foo',
  baz: 'Baz Foo Bar',
});
```

## Intercepting and Viewing E-mails

- On local environment, Mailpit will capture emails.
- You can view the emails in Mailpit Web UI.
- Go to `http://localhost:8025` in your browser.
