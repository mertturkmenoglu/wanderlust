-- name: CreateBookmark :one
INSERT INTO bookmarks (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
) RETURNING *;

-- name: BatchCreateBookmarks :copyfrom
INSERT INTO bookmarks (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
);

-- name: DeleteBookmarkByPoiId :exec
DELETE FROM bookmarks
WHERE poi_id = $1 AND user_id = $2;

-- name: GetBookmarksByUserId :many
SELECT 
  *
FROM bookmarks
WHERE bookmarks.user_id = $1
ORDER BY bookmarks.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountUserBookmarks :one
SELECT COUNT(*) FROM bookmarks
WHERE user_id = $1;

-- name: IsBookmarked :one
SELECT id FROM bookmarks
WHERE poi_id = $1 AND user_id = $2;
