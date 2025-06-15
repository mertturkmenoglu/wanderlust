default:
  just --list

# Live reload
@watch:
  concurrently --pad-prefix \
    --names api,web,flags,ipx \
    -c yellow,red,green,blue \
    "just api/watch" "just web/watch" "just flags/watch" "just wiop/watch";

# Setup the project
@setup:
  echo "=> Setting up the project..."
  chmod u+x ./requirements.sh
  ./requirements.sh
  just api/setup
  just web/setup
  just flags/setup
  just wiop/setup
  echo "=> Setup completed. Run 'just watch' to start the server."

# Type generation
@typegen:
  just web/typegen
