default:
  just --list

# Live reload
@watch:
  if command -v concurrently > /dev/null; then \
    concurrently --names api,web,ipx -c yellow,red,blue "just api/watch" "just web/watch" "just wiop/watch"; \
  else \
    echo "Concurrently is not installed. Run 'pnpm add -g concurrently' to install Concurrently"; \
  fi

# Setup the project
@setup:
  echo "=> Setting up the project..."
  chmod u+x ./requirements.sh
  ./requirements.sh
  just api/setup
  just web/setup
  just wiop/setup
  echo "=> Setup completed. Run 'just watch' to start the server."

# Type generation
@typegen:
  just web/typegen
