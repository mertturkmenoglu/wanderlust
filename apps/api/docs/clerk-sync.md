# Clerk Sync

- User data is stored in Clerk.
- For local development, you must sync Clerk data with the local database instance.
- Run `bun clerk-sync` script to start the synchronization.
- This script will create/update/delete users in local database and it will match Clerk data.
