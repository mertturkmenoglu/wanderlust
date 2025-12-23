# Docker

- We are using Docker to run long-running services.
- We are using Docker Compose to run multiple services.

## Docker Compose

- You can find the Docker Compose file in the API root folder: `docker-compose.yml`
- You can run the following command to start the Docker Compose:

```bash
docker compose up -d
```

- You can run the following command to stop the Docker Compose:

```bash
docker compose down
```

## Services

- `postgres`: PostgreSQL database
- `typesense`: Typesense search engine
- `typesense-dashboard`: Typesense dashboard
- `mailpit`: Email testing tool
- `redis`: Redis cache
