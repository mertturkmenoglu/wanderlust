# Wanderlust - API

## Prerequisites

- Latest Go version
- Just: https://github.com/casey/just
- Docker: https://docs.docker.com/desktop/setup/install/linux/ubuntu/
- Sqlc: https://sqlc.dev/
- Go Migration: https://github.com/golang-migrate/migrate
- Go Air: https://github.com/air-verse/air
- Infisical: https://infisical.com/docs/documentation/getting-started/introduction

## Steps

- Install dependencies: `go mod download`
- Setup environment variables:
  - Using Infisical CLI (recommended, read `infisical.md`), or
  - Manually (create `.env` => copy from `.env.example` and fill)
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
