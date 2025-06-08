# Infisical

- Web project uses [Infisical](https://infisical.com/) to manage secrets.
- Read the docs: https://infisical.com/docs/documentation/getting-started/introduction
- Get CLI.
- Complete CLI login.
- Utilize pnpm commands defined in `package.json` to operate with secrets. Examples:
  - `pnpm env-example` to create `.env.example` file.
  - `pnpm env-pull` to pull secrets from Infisical and export them to `.env` file.
  - `pnpm env-push` to push secrets from `.env` file to Infisical.
