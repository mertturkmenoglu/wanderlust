# Fake Data Generation

You can use `apps/fake` CLI tool to generate fake data for testing and development purposes.

- Before you can use the tool, make sure PostgreSQL is running.
- You must clean the database before generating fake data. You can do this by running the following command (inside the `apps/api` directory):

```bash
# CAREFUL: This will delete all data in the database!
bun run clean
```

- `clean` script will delete **all data** in the database, so make sure you are okay with that before running it.
- After cleaning the database, you can generate fake data by running the following command (inside the `apps/fake` directory):

```bash
bun run fake
```
