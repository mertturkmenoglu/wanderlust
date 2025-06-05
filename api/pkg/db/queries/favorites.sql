-- name: CreateFavorite :one
INSERT INTO favorites (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
)
RETURNING *;

-- name: BatchCreateFavorites :copyfrom
INSERT INTO favorites (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
);

-- name: DeleteFavoriteByPoiId :exec
DELETE FROM favorites
WHERE poi_id = $1 AND user_id = $2;

-- name: GetFavoritesByUserId :many
SELECT *
FROM favorites
WHERE user_id = $1
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountUserFavorites :one
SELECT COUNT(*) FROM favorites
WHERE user_id = $1;

-- name: GetFavoriteById :one
SELECT * FROM favorites
WHERE id = $1;

-- name: IsFavorite :one
SELECT id FROM favorites
WHERE poi_id = $1 AND user_id = $2;
