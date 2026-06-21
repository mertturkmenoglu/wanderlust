# Database

- We are using `PostgreSQL` as our database.
- Make sure the Docker container is running.

## Definitions

- We are using [Drizzle ORM](https://orm.drizzle.team/docs/overview).
- Every definition is inside `packages/db` directory.

## Migrations

- In development, you can use `bun run db:push` command to directly change the database without creating migration files.
- If you want to create migrations, you can run (inside `apps/api` directory):

```sh
bun db:generate
bun db:migrate
```

and follow on-screen prompts.

## Creating a Database Backup

- Run this command: `docker exec postgres pg_dump -U postgres -C -f wl.dump -Fc wanderlust > wl.dump`
- Check the Docker container -> Files -> wl.dump
- You can right click to save it to your local machine (via Docker Desktop).

## Writing Query Results to a File

- Sometimes you may want to write the result of a query to a file.
- You can do this by running the following command (change the query as needed):

```bash
docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM users" --csv -o /home/file.csv
docker cp wl-postgres:/home/file.csv tmp/file.csv
```

- First command will run the query and write the result to a file called `file.csv` in the Docker container's home directory.
- Second command will copy the file from the Docker container to the `tmp` directory (of the local machine).
