-- name: CreateFavorite :one
INSERT INTO favorites (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
)
RETURNING *;

-- name: DeleteFavoriteByPoiId :exec
DELETE FROM favorites
WHERE poi_id = $1 AND user_id = $2;

-- name: GetFavoritesByUserId :many
SELECT 
  sqlc.embed(favorites),
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM favorites
  JOIN pois ON pois.id = favorites.poi_id
  JOIN categories ON categories.id = pois.category_id
  JOIN addresses ON addresses.id = pois.address_id
  JOIN cities ON addresses.city_id = cities.id
  JOIN media ON media.poi_id = pois.id
WHERE favorites.user_id = $1 AND media.media_order = 1
ORDER BY favorites.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountUserFavorites :one
SELECT COUNT(*) FROM favorites
WHERE user_id = $1;

-- name: GetFavoriteById :one
SELECT sqlc.embed(favorites), sqlc.embed(pois) FROM favorites
JOIN pois ON pois.id = favorites.poi_id
WHERE favorites.id = $1;

-- name: IsFavorite :one
SELECT id FROM favorites
WHERE poi_id = $1 AND user_id = $2;
