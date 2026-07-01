# Setup

## Prerequisites and Environment Variables
- Make sure you have installed all the prerequisites mentioned in the [Prerequisites](prerequisites.md) section.
- Go to the root directory of the project in your terminal.
- Install all dependencies:

```bash
bun install
```

- You can check if you have the prerequisites (correctly) installed and running:

```bash
bun wl doctor
```

- Create a `.env` file in the root directory of the project. You can copy the example `.env.example` file provided in the project via the following command:

```bash
cp .env.example .env
```

- Fill the missing values in the `.env` file with your own configuration.
- If you don't supply Facebook and Google OAuth credentials, you can still use the application, but you won't be able to log in using those providers:
	- Better Auth Google provider setup: https://better-auth.com/docs/authentication/google#get-your-google-credentials
	- Better Auth Facebook provider setup: https://better-auth.com/docs/authentication/facebook#get-your-facebook-credentials
- If you don't supply a Maptiler API key, you can still use the application but you won't be able to use any map features.
	- Maptiler API key setup: https://docs.maptiler.com/guides/getting-started/

## Setting up the development environment
You need to:
- Create Docker containers
- Push database schema
- Create object storage buckets,
- and grant bucket permissions.
	
You can do this by running the following command:

```bash
bun wl clean
```

Clean command removes and recreates the Docker containers (uses `apps/api/docker-compose.yml`), pushes the database schema, creates SeaweedFS buckets, and grants the necessary permissions to the buckets.

You can use this command to reset your development environment at any time. It will remove all data in the database and object storage buckets, so use it with caution.

- After completing the above steps, we highly recommend populating your database with some fake data for development and testing purposes. You can do this by running the following command:

```bash
bun wl fake
```

Fake command (runs `apps/fake` sub module) creates fake users, places, lists, reviews, and some other data in the database. You should at least check out this file `apps/fake/src/handlers/users.ts` to see how the fake users are created. You can also see an example email+password login that you can use to log in to the application.

- After fake data generation, you should sync Typesense with the primary (PostgreSQL) database. You can do this by running the following command:

```bash
bun wl sync
```

This command drops the existing Typesense collections and recreates them with the data from the primary database. You can also run this command at any time to re-sync the Typesense collections with the primary database. Be aware that if it fails during the sync process, you may have a partially synced collection or even without a collection in Typesense.

- After completing all the above steps, you can start all the development servers by running the following command:

```bash
bun dev
```

`dev` command utilizes `Turbo` to run all the development tasks in parallel:
- Any submodule inside `apps` directory is an independent application that runs on its specified port.
- Any submodule inside `packages` directory is a shared library that is constantly watched for changes and recompiled via `tsc --watch` command.

Now you can visit `http://localhost:3000` in your browser to see the application running.

To see all the ports used by the application, see [ports](ports.md) document.
