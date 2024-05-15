# Wanderlust - API

## Prerequisites

- Bun
- Docker
- ngrok (https://dashboard.ngrok.com/get-started/setup)

## Environment Variables

Either setup manually or use Dotenv Vault (preferred).

### Setup Dotenv Vault

- Preferred way to manage environment variables.
- See the Dotenv Vault Docs here: https://www.dotenv.org/docs/quickstart/sync
- Login to your account.
- Use `env:pull` and `env:push` scripts in `package.json` to manage secrets.

### Manual Environment Variables Setup

- Create `.env` file in the root API directory.
- Copy from `.env.example` to `.env` file.
- Fill out the empty values.
- Defaults for some keys for the development environment can be found in `src/env.ts`.
- Other keys must be obtain from services or generated.
  - Get Clerk secrets: https://dashboard.clerk.com/

## Run Development Server

- Start Docker containers: `docker compose up`
- Start the API server: `bun dev`
- Start ngrok: `ngrok http --domain=welcomed-communal-raven.ngrok-free.app 5000` or `bun ngrok`

## Getting Long Lived Token for API Development Testing

- Open Web App.
- Sign in as any user.
- Open DevTools Console.
- Get the token with this command: `window.Clerk.session.getToken({ template: "api-testing-token-template" }).then((data) => { console.table(data) })`
- Token lives for 24 hours.
- Send the token in headers: `Authorization: Bearer YOUR_TOKEN`

## Ports

- API server: `localhost:5000`
- Postgres: `localhost:5432`
- Redis: `6379`
- MinIO: `localhost:9000` and `localhost:9001` (Web UI)
- Ngrok Web UI: `localhost:4040`
- Typesense: `localhost:8108`

## Tech Stack

- `Bun`: JS/TS runtime
- `Hono`: Web server
- `Docker`: Running containers + defining services (Docker Compose)
- `Clerk`: Authentication service
- `Drizzle`: ORM
- `Postgres`: Database
- `Redis` and `ioredis`: Caching
- `Zod`: Schema validation
- `MinIO`: S3 compatible file storage
- `Svix`: Web hooks
- `Typesense`: Search engine
- `Envalid`: Environment configuration and validation
- `ngrok`: Opening local webserver to internet (reverse proxy)
