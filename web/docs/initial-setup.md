# Initial Setup

## Prerequisites

- Node.js LTS version
- PNPM

## Steps

- Install dependencies: `pnpm install`
- Setup environment variables:
  - Copy `.env.example` to `.env` and fill
- Make sure the API is running.
- Make sure the image proxy server (wiop) is running.
- Generate TypeScript definitions from OpenAPI spec: `pnpm openapi`
- Run the development server: `pnpm dev`
- Server will run at port `3000`.

## Next Steps

Follow these steps in this specific order:

- Read `type-gen.md` file.
- Read `ipx.md` file.
