-- name: CreateState :one
INSERT INTO states (
  id,
  name,
  country_id,
  country_code,
  country_name,
  state_code,
  type,
  latitude,
  longitude
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9
) RETURNING *;
