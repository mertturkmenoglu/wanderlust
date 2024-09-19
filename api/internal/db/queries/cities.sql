-- name: CreateCities :copyfrom
INSERT INTO cities (
  id,
  name,
  state_code,
  state_name,
  country_code,
  country_name,
  image_url,
  latitude,
  longitude,
  description
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
  $10
);

-- name: GetCityById :one
SELECT * FROM cities
WHERE cities.id = $1 LIMIT 1;

-- name: RandSelectCities :many
SELECT id
FROM cities
ORDER BY RANDOM()
LIMIT $1;

-- name: GetCities :many
SELECT * FROM cities;

-- name: GetFeaturedCities :many
SELECT * FROM cities
WHERE id = ANY($1::int[]);
