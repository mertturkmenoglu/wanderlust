# Authentication

- We are using [Better Auth](https://www.better-auth.com/) for authentication.
- All apps and packages uses a common auth package located at `packages/auth`.
- You can see the auth OpenAPI endpoints at: `http://localhost:5000/api/auth/`

# Authorization

Although we have plans for using a dedicated authorization library, we are currently relying on custom authorization checks.

The convention we are following is creating an `authz.ts` file in the same directory as the `service.ts` that uses it and add functions that check if the user has the required permissions to perform certain actions.
