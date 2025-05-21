# Run SQL queries and dump their results to a CSV file.
# Then copy the CSV file from the Docker container to the host machine.
# Make sure you are running this script from the api project root directory.

docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM pois" --csv -o /home/pois.csv
docker cp wl-postgres:/home/pois.csv tmp/pois.csv
tail -n +2 tmp/pois.csv > tmp/pois.txt
rm tmp/pois.csv

docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM users" --csv -o /home/users.csv
docker cp wl-postgres:/home/users.csv tmp/users.csv
tail -n +2 tmp/users.csv > tmp/users.txt
rm tmp/users.csv