-- name: CreateBookmark :one
INSERT INTO bookmarks (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
)
RETURNING *;

-- name: DeleteBookmarkByPoiId :exec
DELETE FROM bookmarks
WHERE poi_id = $1 AND user_id = $2;

-- name: GetBookmarksByUserId :many
SELECT 
  sqlc.embed(bookmarks),
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM bookmarks
  JOIN pois ON pois.id = bookmarks.poi_id
  JOIN categories ON categories.id = pois.category_id
  JOIN addresses ON addresses.id = pois.address_id
  JOIN cities ON addresses.city_id = cities.id
  JOIN media ON media.poi_id = pois.id
WHERE bookmarks.user_id = $1 AND media.media_order = 1
ORDER BY bookmarks.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountUserBookmarks :one
SELECT COUNT(*) FROM bookmarks
WHERE user_id = $1;

-- name: GetBookmarkById :one
SELECT sqlc.embed(bookmarks), sqlc.embed(pois) FROM bookmarks
JOIN pois ON hservices.id = bookmarks.poi_id
WHERE bookmarks.id = $1;

-- name: IsBookmarked :one
SELECT id FROM bookmarks
WHERE poi_id = $1 AND user_id = $2;
