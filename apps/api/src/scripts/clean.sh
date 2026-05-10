docker compose down -v

docker compose up -d

sleep 1

bun run db:push
