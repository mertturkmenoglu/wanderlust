# Initial Setup

## Prerequisites

- Latest Go version
- make
- Docker
- sqlc: https://sqlc.dev/
- go migration: https://github.com/golang-migrate/migrate
- air: https://github.com/air-verse/air
- swag: https://github.com/swaggo/swag

## Steps

- Install dependencies: `go mod download`
- Run sqlc to generate latest database queries & types: `make sqlc-generate`
- Create a `.env` file.
- Copy the content of `.env.example` file to `.env` file.
- Fill the missing values.
- Run Docker containers: `docker compose up -d`
- Run the development server: `make watch`

## Next Steps

Follow these steps in this specific order:

- Read `database.md` file.
- Read `fake.md` file.
- Read `search-sync.md` file.
- Read `swagger.md` file.
