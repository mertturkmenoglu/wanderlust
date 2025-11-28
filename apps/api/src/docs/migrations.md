# Migrations

## Prerequisites

- You need `goose` installed on your system.

## Running

- Goose expects these environment variables to be set:
  - `GOOSE_DRIVER`: Database driver (e.g. `postgres`)
  - `GOOSE_DBSTRING`: Database connection string (e.g. `postgres://postgres:postgres@localhost:5432/wanderlust`)
  - `GOOSE_DIR`: Directory where migrations are stored (e.g. `./pkg/db/migrations`)
- Run `goose create <migration_name> sql` command.
- Goose will create a new migration file inside the `pkg/db/migrations` directory.
- Example file name:
  - `20250531105008_squirrels.sql`
- Add up and down SQL statements to the migration file.
- Run `goose up` to apply the migration.

## Other Commands

- `goose -h`: Help
- `goose up`: Apply all migrations
- `goose up-by-one`: Apply the next migration
- `goose down`: Revert the last migration
- `goose redo`: Re-run the last migration
- `goose reset`: Roll back all migrations
