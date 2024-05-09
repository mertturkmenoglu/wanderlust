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
