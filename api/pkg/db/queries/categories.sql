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

-- name: GetCategories :many
SELECT * FROM categories;

-- name: DeleteCategory :exec
DELETE FROM categories
WHERE id = $1;

-- name: UpdateCategory :one
UPDATE categories
SET 
  name = $2,
  image = $3
WHERE id = $1
RETURNING *;
