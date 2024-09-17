-- name: CreateCities :copyfrom
INSERT INTO cities (
  id,
  name,
  state_id,
  state_code,
  state_name,
  country_id,
  country_code,
  country_name,
  latitude,
  longitude,
  wiki_data_id
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11
);

-- name: GetCityById :one
SELECT sqlc.embed(cities), sqlc.embed(states), sqlc.embed(countries) FROM cities
LEFT JOIN states ON cities.state_id = states.id
LEFT JOIN countries ON cities.country_id = countries.id
WHERE cities.id = $1 LIMIT 1;
