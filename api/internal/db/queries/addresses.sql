-- name: CreateAddress :one
INSERT INTO addresses (
  country,
  city,
  line1,
  line2,
  postal_code,
  state,
  lat,
  lng
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
) RETURNING *;

-- name: BatchCreateAddresses :copyfrom
INSERT INTO addresses (
  country,
  city,
  line1,
  line2,
  postal_code,
  state,
  lat,
  lng
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
);

-- name: RandSelectAddresses :many
SELECT id
FROM addresses
ORDER BY RANDOM()
LIMIT $1;
