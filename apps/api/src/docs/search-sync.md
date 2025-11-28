# Search Sync Command

This script will sync your database resources with Typesense.

## Prerequisites

- Make sure your database and Typesense are up and running.

## Running

- Run `just search` command.
- Follow the on screen instructions to start the synchronization.
- First you must select the type of resource you want to sync.
- Script will start and read data from database and try to upsert it to Typesense.
- Any error encountered during synchronization will terminate the script.
- Previously upserted data will be untouched, Typsense will have the latest values of those entries.

# Typesense Dashboard

- You can view the Typesense dashboard at `http://localhost:3006/`.
