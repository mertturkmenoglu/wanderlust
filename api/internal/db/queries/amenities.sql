-- name: CreateAmenity :one
INSERT INTO amenities (
  name
) VALUES (
  $1
) RETURNING *;
