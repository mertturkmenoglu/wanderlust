concurrently --names api,web,ipx -c yellow,red,blue "cd api && make watch" "cd web && pnpm dev" "cd wiop && pnpm start"
