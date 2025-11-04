# Wanderlust - Web

## Prerequisites

- (Node.js LTS version)[https://nodejs.org/en/download]
- (PNPM)[https://pnpm.io/installation]
- (Just)[https://github.com/casey/just]

## Setup

Make sure other services are running:

- API
- Image optimization service (wiop)
- Feature flags service (flags)
- Search service (In `api` project's Docker Compose file, find TypeSense)

After you ensure that all the services are running, you can proceed with the setup.

You can either use the automatic setup with Just or manually setup the project.

### Automatic Setup with Just

- Run `just setup` to install dependencies.
- Run `just typegen` to generate TypeScript definitions from OpenAPI spec.
- Run `just watch` to start the development server.

### Manual Setup

- Install dependencies: `pnpm install`
- Setup environment variables:
  - `touch .env`
  - open `.env` file
  - Copy the contents of `.env.example` and fill in the values
- Generate TypeScript definitions from OpenAPI spec: `pnpm openapi`
- Run the development server: `pnpm dev`
- Server will run at port `3000`.

## Next Steps

Inside the `docs` folder, you can find documentation files.

Read these documentation files in this specific order:

- Read `type-gen.md` file.
- Read `ipx.md` file.
- Read `flags.md` file.
