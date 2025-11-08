-- name: CreateCity :one
INSERT INTO cities (
  id,
  name,
  state_code,
  state_name,
  country_code,
  country_name,
  image,
  lat,
  lng,
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

-- name: BatchCreateCities :copyfrom
INSERT INTO cities (
  id,
  name,
  state_code,
  state_name,
  country_code,
  country_name,
  image,
  lat,
  lng,
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

-- name: FindCityById :one
SELECT * FROM cities
WHERE cities.id = $1 LIMIT 1;

-- name: FindManyCityIdsByRand :many
SELECT id
FROM cities
ORDER BY RANDOM()
LIMIT $1;

-- name: FindManyCities :many
SELECT * FROM cities
ORDER BY id;

-- name: FindManyCitiesById :many
SELECT * FROM cities
WHERE id = ANY($1::int[]);

-- name: UpdateCity :execresult
UPDATE cities
SET
  name = $2,
  state_code = $3,
  state_name = $4,
  country_code = $5,
  country_name = $6,
  image = $7,
  lat = $8,
  lng = $9,
  description = $10
WHERE id = $1;

-- name: RemoveCityById :execresult
DELETE FROM cities
WHERE id = $1;
