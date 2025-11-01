-- name: CreateFavorite :one
INSERT INTO favorites (
  user_id,
  place_id
) VALUES (
  $1,
  $2
) RETURNING *;

-- name: BatchCreateFavorites :copyfrom
INSERT INTO favorites (
  user_id,
  place_id
) VALUES (
  $1,
  $2
);

-- name: RemoveFavoriteByPlaceIdAndUserId :execresult
DELETE FROM favorites
WHERE place_id = $1 AND user_id = $2;

-- name: FindManyFavoritesByUserId :many
SELECT
  *
FROM favorites
WHERE user_id = $1
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountFavoritesByUserId :one
SELECT COUNT(*) FROM favorites
WHERE user_id = $1;

-- name: IsPlaceFavorited :one
SELECT EXISTS (
  SELECT 1 FROM favorites
  WHERE place_id = $1 AND user_id = $2
);

-- name: CountFavoritesByPlaceId :one
SELECT COUNT(*) FROM favorites
WHERE place_id = $1;
