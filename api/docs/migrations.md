# Migrations

## Prerequisites

- You need `go-migrate` installed on your system: https://github.com/golang-migrate/migrate

## Running

- Run `just create-migration` command.
- It will ask for a file name. Enter a valid and meaningful name for your migration. Example: `create_users_table`
- Go Migrate will create up and down SQL files inside the `internal/pkg/db/migrations` folder.
- Example file names:
  - `000001_create_users_table.down.sql`
  - `000001_create_users_table.up.sql`
- Go and add database changes you want to run to `.up.sql` file.
- Also add the reverse operations to `.down.sql` file.
- Next time you run the app with `RUN_MIGRATIONS=1` flag, app will check the database and run the necessary migrations.
