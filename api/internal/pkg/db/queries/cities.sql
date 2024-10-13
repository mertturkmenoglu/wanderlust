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
SELECT * FROM cities
ORDER BY id;

-- name: GetFeaturedCities :many
SELECT * FROM cities
WHERE id = ANY($1::int[]);

-- name: CreateCity :one
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
) RETURNING *;

-- name: UpdateCity :one
UPDATE cities
SET 
  name = $2,
  state_code = $3,
  state_name = $4,
  country_code = $5,
  country_name = $6,
  image_url = $7,
  latitude = $8,
  longitude = $9,
  description = $10
WHERE id = $1
RETURNING *;

-- name: DeleteCity :exec
DELETE FROM cities
WHERE id = $1;
