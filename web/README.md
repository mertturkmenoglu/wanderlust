# Wanderlust - Web

## Prerequisites

- Node.js LTS version
- PNPM

## Steps

- Install dependencies: `pnpm install`
- Setup environment variables:
  - Using Infisical CLI (recommended, read `infisical.md`), or
  - Manually (create `.env` => copy from `.env.example` and fill)
- Make sure the API is running.
- Make sure the image proxy server (wiop) is running.
- Generate TypeScript definitions from OpenAPI spec: `pnpm openapi`
- Run the development server: `pnpm dev`
- Server will run at port `3000`.

## Next Steps

Inside the `docs` folder, you can find documentation files.

Read these documentation files in this specific order:

- Read `infisical.md` file.
- Read `type-gen.md` file.
- Read `ipx.md` file.
