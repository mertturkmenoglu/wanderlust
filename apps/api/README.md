# Wanderlust - API

## Prerequisites

- Bun
- Docker
- ngrok (https://dashboard.ngrok.com/get-started/setup)

## Run Development Server

- Set environment variables.
  - Get Clerk secrets: https://dashboard.clerk.com/
- Start Docker containers: `docker compose up`
- Start the API server: `bun dev`
- Start ngrok: `ngrok http --domain=welcomed-communal-raven.ngrok-free.app 5000`

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
