## API Development Token

You must obtain a long lived token for API development.

## Steps

- Open Web App.
- Sign in as any user.
- Open DevTools Console.
- Get the token with this command: `window.Clerk.session.getToken({ template: "api-testing-token-template" }).then((data) => { console.table(data) })`
- Token lives for 24 hours.
- Send the token in headers: `Authorization: Bearer YOUR_TOKEN`
