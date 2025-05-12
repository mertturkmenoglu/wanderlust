-- name: CreateTrip :one
INSERT INTO trips (
  id,
  owner_id,
  status,
  visibility_level,
  start_at,
  end_at
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;

-- name: GetTripById :one
SELECT * FROM trips WHERE id = $1;
