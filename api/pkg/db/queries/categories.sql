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

-- name: FinyManyCategories :many
SELECT * FROM categories;

-- name: RemoveCategoryById :execresult
DELETE FROM categories
WHERE id = $1;

-- name: UpdateCategory :execresult
UPDATE categories
SET
  name = $2,
  image = $3
WHERE id = $1;
