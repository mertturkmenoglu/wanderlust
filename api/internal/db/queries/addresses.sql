-- name: CreateAddress :one
INSERT INTO addresses (
  city_id,
  line1,
  line2,
  postal_code,
  lat,
  lng
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;

-- name: BatchCreateAddresses :copyfrom
INSERT INTO addresses (
  city_id,
  line1,
  line2,
  postal_code,
  lat,
  lng
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
);

-- name: RandSelectAddresses :many
SELECT id
FROM addresses
ORDER BY RANDOM()
LIMIT $1;
