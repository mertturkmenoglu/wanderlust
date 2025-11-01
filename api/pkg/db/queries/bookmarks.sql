-- name: CreateBookmark :one
INSERT INTO bookmarks (
  user_id,
  place_id
) VALUES (
  $1,
  $2
) RETURNING *;

-- name: BatchCreateBookmarks :copyfrom
INSERT INTO bookmarks (
  user_id,
  place_id
) VALUES (
  $1,
  $2
);

-- name: RemoveBookmarkByPlaceIdAndUserId :execresult
DELETE FROM bookmarks
WHERE place_id = $1 AND user_id = $2;

-- name: FindManyBookmarksByUserId :many
SELECT
  *
FROM bookmarks
WHERE bookmarks.user_id = $1
ORDER BY bookmarks.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountBookmarksByUserId :one
SELECT COUNT(*) FROM bookmarks
WHERE user_id = $1;

-- name: IsPlaceBookmarked :one
SELECT EXISTS (
  SELECT 1 FROM bookmarks
  WHERE place_id = $1 AND user_id = $2
);
