#!/bin/env bash

# Run SQL queries and dump their results to a CSV file.
# Then copy the CSV file from the Docker container to the host machine.
# Make sure you are running this script from the api project root directory.

domains=(
  "pois"
  "users"
  "reviews"
  "collections"
)

for i in "${!domains[@]}"; do
  domain="${domains[$i]}"
  docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM $domain" --csv -o /home/$domain.csv
  docker cp wl-postgres:/home/$domain.csv tmp/$domain.csv
  tail -n +2 tmp/$domain.csv > tmp/$domain.txt
  rm tmp/$domain.csv
done
