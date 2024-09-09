-- name: CreateCity :one
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
) RETURNING *;
