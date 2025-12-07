# Authentication

- We are using [Better Auth](https://www.better-auth.com/) for authentication.
- All authn related code can be found at `src/lib/auth/index.ts` file.
- `GET` and `POST` requests to the `/api/auth/**` endpoints are routed to the auth client.
- You cannot see the auth endpoints on OpenAPI docs yet.
