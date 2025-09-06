# Environment Variables

- `pkg/cfg/cfg.go` file contains a schema for the environment variables.
- Development environment values are set in this file.
- Run `just env` to generate `.env` file based on this schema and development environment values.
- Some values are required, so fill the missing values (empty values) in `.env` file.
  - Like `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`.
