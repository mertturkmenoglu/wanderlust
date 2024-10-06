-- name: CreateCollection :one
INSERT INTO collections (
  name,
  description
) VALUES (
  $1,
  $2
) RETURNING *;

-- name: GetCollectionById :one
SELECT * FROM collections
WHERE id = $1 LIMIT 1;

-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = $1;

-- name: GetCollections :many
SELECT * FROM collections
ORDER BY created_at DESC
OFFSET $1
LIMIT $2;
