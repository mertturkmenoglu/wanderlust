-- name: CreateCategory :one
INSERT INTO categories (
  id,
  name,
  image
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;
