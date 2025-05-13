concurrently --names api,web,ipx -c yellow,red,blue "cd api && just watch" "cd web && pnpm dev" "cd wiop && pnpm start"
