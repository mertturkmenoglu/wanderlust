# Initial Setup

## Prerequisites

- Make sure you have these software are installed and configured correctly:
  - Bun
  - Docker
  - ngrok (https://dashboard.ngrok.com/get-started/setup)

## Steps

- Setup environment variables. Read `environment-variables.md` file.
- Run the three major processes:
  - Start Docker containers `docker compose up`
  - Start the API server: `bun dev`
  - Start ngrok: `bun ngrok`
- Obtain an API development token. Read `api-development-token.md` file.
- Sync Clerk with local database. Read `clerk-sync.md` file.
- Run fake data scripts. Read `fake-data-generation.md` file.
