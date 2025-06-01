# Wanderlust - API

## Prerequisites

- Latest Go version
- Just: https://github.com/casey/just
- Docker: https://docs.docker.com/desktop/setup/install/linux/ubuntu/
- Sqlc: https://sqlc.dev/
- Goose: https://github.com/pressly/goose
- Go Air: https://github.com/air-verse/air
- Infisical: https://infisical.com/docs/documentation/getting-started/introduction

## Setup

- Run `just setup` to setup the project.
- Run `just watch` to start the server.

or you can follow these steps for manual setup:

- Install dependencies: `go mod download`
- Setup environment variables:
  - Using Infisical CLI (recommended, read `infisical.md`), or
  - Manually (create `.env` => copy from `.env.example` and fill)
- Run migrations with Goose: `goose up`
- Run sqlc to generate latest database queries & types: `just sqlc`
- Run Docker containers: `docker compose up -d`
- Run the development server: `just watch`
- Server will run at port `5000`.

## Next Steps

Inside the `docs` folder, you can find documentation files.

Read these documentation files in this specific order:

- `infisical.md`
- `justfile.md`
- `database.md`
- `migrations.md`
- `fake.md`
- `search-sync.md`
- `openapi.md`
- `minio.md`

Now you should be able to run the project locally and have some ideas about the services. Read these files to continue:

- `project-structure.md`
- `architecture.md`
- `abbreviations.md`
- `email.md`
- `scalar.md`
- `telemetry.md`
- `asynq.md`
