# Wanderlust API

## Prerequisites

- Bun (https://bun.sh/)

## Setup

- Add `.env` file and fill the missing values (you can refer to `.env.example`).
- Create `tmp` and `uploads` folders:

```bash
mkdir tmp uploads
```

- Start the Docker daemon and run:

```bash
docker compose up -d
```

- Apply schema to the database:

```bash
bun run db:push
```

- Generate fake data:

```bash
bun run fake
```

- Sync primary database with Typesense:

```bash
bun run search
```

## Running

- Run `bun dev` to start the development server.

## Next Steps

Please read the `docs/index.md` file about the next steps to take after setting up the project.
