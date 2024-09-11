# Database

- Make sure Postgres is running.
- Install `sqlc`: `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`
- Install `go-migrate`
- Run `make create-migrations` to create a new migration.
- Run the app with `RUN_MIGRATIONS=1` environment variable to auto run migrations when app is started.
- Or, you can run `make watch` to run the app with auto migration option enabled.
- Generate Go files from your schema and query files: `sqlc generate` or `make sqlc-generate`.

# Updating the database & models & queries

- Run `make create-migrations`, give migration a name, and check `internal/db/migrations` folder for the generated migration file.
- Fill `.down.sql` and `.up.sql` files with the SQL statements to migrate the database.
- Go to `internal/db/schema.sql` and add the table definitions.
- Go to `internal/db/queries` folder and create/update the query file.
- Run `make sqlc-generate` to generate Go files from the schema and query files.

# Example Workflow

- Let's say you want to create a new table called `squirrels`.
- First, you need to create a new migration:

  - Run `make create-migrations`.
  - Give the migration a name, like `create_squirrels_table`.
  - Script will create `.up.sql` and `.down.sql` files inside `internal/db/migrations` folder.

- Open the `.up.sql` file and write the SQL statements to create the table.
- Open the `.down.sql` file and write the SQL statements to drop the table.

```sql
-- create_squirrels_table.up.sql
CREATE TABLE IF NOT EXISTS squirrels (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  age INT NOT NULL
);
```

```sql
-- create_squirrels_table.down.sql
DROP TABLE IF EXISTS squirrels;
```

- Now you need to copy the table definition and paste it into `internal/db/schema.sql` file.

- Now you need to create a new query file inside `internal/db/queries` folder.

- Add your CRUD operations to the query file.

```sql
-- name: GetSquirrelById :one
SELECT * FROM squirrels
WHERE id = $1 LIMIT 1;

-- name: CreateSquirrel :one
INSERT INTO squirrels (
  name,
  age
) VALUES (
  $1,
  $2
) RETURNING *;
```

- Run `make sqlc-generate` to generate Go files from the schema and query files.

- In your Go code, you can now use the generated functions to interact with the database.

```go
func foo(id int32) (db.Squirrel, error) {
  // Get db connection from somewhere
  d := GetDb()
  return d.Queries.GetSquirrelById(context.Background(), id)
}
```