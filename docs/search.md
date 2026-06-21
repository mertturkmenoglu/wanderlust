# Search

We are using Typesense as our search engine.

Please read Typesense documentation for more information: [https://typesense.org/docs/](https://typesense.org/docs/)

You can use Typesense Dashboard to view and manage your Typesense resources. You can access the dashboard at `http://localhost:3006/`.

## Syncing Database with Typesense

You must manually sync the primary database (PostgreSQL) with Typesense. This is done using a script that reads data from the database and upserts it to Typesense.

Make sure PostgreSQL and Typesense are up and running before executing the script.

Inside `apps/api` folder, run the following command to sync:

```bash
bun run search
```
