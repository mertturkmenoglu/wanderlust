# Database

- Make sure Postgres is running.
- Install `sqlc`: `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`
- Install `go-migrate`
- Run `just create-migrations` to create a new migration.
- Run the app with `RUN_MIGRATIONS=1` environment variable to auto run migrations when app is started.
- Or, you can run `just watch` to run the app with auto migration option enabled.
- Generate Go files from your schema and query files: `just sqlc`.

## Updating the database & models & queries

- Run `just create-migrations`, give migration a name, and check `internal/pkg/db/migrations` folder for the generated migration file.
- Fill `.down.sql` and `.up.sql` files with the SQL statements to migrate the database.
- Go to `internal/db/queries` folder and create/update the query file.
- Run `just sqlc` to generate Go files from the schema and query files.

## Example Workflow

- Let's say you want to create a new table called `squirrels`.
- First, you need to create a new migration:

  - Run `just create-migrations`.
  - Give the migration a name, like `create_squirrels_table`.
  - Script will create `.up.sql` and `.down.sql` files inside `internal/pkg/db/migrations` folder.

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

- Now you need to create a new query file inside `internal/pkg/db/queries` folder.

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
docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM pois" -o /home/file.txt
```

- This command will run the query and write the result to a file called `file.txt` in the Docker container's home directory.
- To see the file, follow these steps:
  - Open Docker Desktop, click on the container (`wl-postgres`).
  - Click on the "Files" tab.
  - Navigate to `/home` directory.
  - Right click on the `file.txt` file and select "Save".
  - Select the location where you want to save the file.

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
