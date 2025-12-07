# Email

- We are using the `nodemailer` package for sending emails and `handlebars` for templating.
- You can find the mail service code in `src/lib/email` folder.
- We are using `axllent/mailpit` for testing emails.
- Mailpit acts as an SMTP server, captures emails, and provides a Web UI (`http://localhost:8025`) for viewing emails.
- Check Docker Compose file for mailpit configuration.
- Mail service expects these config variables to be set (config.toml):
  - `email/from`: Sender email address.
  - `email/host`: SMTP server host. For development, use `localhost`.
  - `email/port`: SMTP server port. For development, use `1025`.
  - `email/ssl`: SMTP server SSL flag. For development, use `false`.
- Email templates should be placed in `src/templates` folder.

## Sending Emails

- Create a new file in `src/templates` folder with the `.hbs` extension.
- Use other files in the same folder as a reference.
- You can use variables in the template by using `{{VariableName}}` syntax.
- Define a new params type in `src/lib/email/types.ts` file. Example:

```typescript
export type FooParams = {
  foo: string;
  bar: string;
  baz: string;
};
```

- You must add the same variables you used in the template to the params type.
- Add a new entry to the templates map in `src/lib/email/templates.ts` file. Example:

```typescript
export const templates = {
  // ...
  // ...
  foo: compile<FooParams>('foo.hbs'),
} satisfies Record<string, HandlebarsTemplateDelegate>;
```

- Add a new entry to the subjects map in `src/lib/email/subjects.ts` file. Example:

```typescript
export const subjects = {
  // ...
  // ...
  foo: 'Foo Bar Baz',
} satisfies Record<string, string>;
```

- You **must not** directly call the `sendMail` method of the mail client.
- Instead, use the jobs service to schedule a new task for sending the email.
- Open `src/lib/jobs/email/index.ts` file.
- Add a new entry to the schemas object. Example:

```typescript
const schemas = z.object({
  // ...
  // ...
  'emails/send-foo': z.object({
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
case 'emails/send-foo': {
	const data = job.data as Schemas['emails/send-foo'];
	await email.sendMail({
		from: env.email.from,
		to: data.email,
		subject: subjects.foo,
		html: templates.foo({
			foo: data.foo,
			bar: data.bar,
			baz: data.baz,
		}),
	});
	break;
}
```

- To send an email, use the jobs service:

```typescript
await jobs.email.queue.add('emails/send-foo', {
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
