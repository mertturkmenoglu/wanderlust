# Database

- Make sure Postgres is running.
- Install `sqlc`
- Install `goose`
- You can run migrations with this command: `goose up`
- Generate Go files from your schema and query files: `just sqlc`.

## Updating the database & models & queries

- You can create a new miration with `goose create` command. Example:

```bash
goose create add_squirrels_table sql
```

- Check the `pkg/db/migrations` directory for the generated migration file.
- Fill up and down SQL statements in the migration file.
- Run `goose up` to apply the migration.
- Go to `pkg/db/queries` directory and create a new query file (or update an existing one).
- Run `just sqlc` to generate Go files from the query files.

## Example Workflow

- Let's say you want to create a new table called `squirrels`.
- First, you need to create a new migration:
  - Run `goose create add_squirrels_table sql`.
- Open `pkg/db/migrations` directory, find the generated migration file, and fill up and down SQL statements.

```sql
-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS squirrels (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  age INT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS squirrels;
-- +goose StatementEnd
```

- Run `goose up` to apply the migration.
- Now you need to create a new query file inside `pkg/db/queries` directory.

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

- Run `just sqlc` to generate Go files from the schema and query files.

- In your Go code, you can now use the generated functions to interact with the database.

```go
func foo(id int32) (db.Squirrel, error) {
  // Get db connection from somewhere
  d := GetDb()
  return d.Queries.GetSquirrelById(context.Background(), id)
}
```

## Creating a Database Backup

- Run this command: `docker exec postgres pg_dump -U postgres -C -f wlbak.dump -Fc wanderlust > wlbak.dump`
- Check the Docker container -> Files -> wlbak.dump
- You can right click to save it to your local machine (via Docker Desktop).

## Writing Query Results to a File

- Sometimes you may want to write the result of a query to a file.
- You can do this by running the following command:

```bash
docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM pois" --csv -o /home/file.csv
docker cp wl-postgres:/home/file.csv tmp/file.csv
```

- First command will run the query and write the result to a file called `file.csv` in the Docker container's home directory.
- Second command will copy the file from the Docker container to the `tmp` directory.

## Using Transactions

- Here's an example of how to use transactions:

```go
func foo(ctx context.Context, d *db.Db) error {
  tx, err := d.Pool.Begin(ctx)

  if err != nil {
    return err
  }

  defer tx.Rollback(ctx)

  qtx := d.Queries.WithTx(tx)

  err = qtx.SomeQuery(ctx, "FOO")

  if err != nil {
    return err
  }

  err = qtx.AnotherQuery(ctx, "BAR")

  if err != nil {
    return err
  }

  err = tx.Commit(ctx)

  if err != nil {
    return err
  }

  return nil
}
```
