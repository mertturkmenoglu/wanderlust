# Environment Variables

Either setup manually or use Dotenv Vault (preferred).

## Setup Dotenv Vault

- Preferred way to manage environment variables.
- See the Dotenv Vault Docs here: https://www.dotenv.org/docs/quickstart/sync
- Login to your account.
- Use `env:pull` and `env:push` scripts in `package.json` to manage secrets.

## Manual Environment Variables Setup

- Create `.env` file in the root API directory.
- Copy from `.env.example` to `.env` file.
- Fill out the empty values.
- Defaults for some keys for the development environment can be found in `src/env.ts`.
- Other keys must be obtain from services or generated.
  - Get Clerk secrets: https://dashboard.clerk.com/
