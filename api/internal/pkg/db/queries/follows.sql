-- name: IsUserFollowing :one
SELECT EXISTS (
  SELECT 1
  FROM follows
  WHERE follower_id = $1 AND following_id = $2
);

-- name: Follow :exec
INSERT INTO follows (
  follower_id,
  following_id
) VALUES (
  $1,
  $2
);

-- name: Unfollow :exec
DELETE FROM follows
WHERE follower_id = $1 AND following_id = $2;

-- name: GetUserFollowers :many
SELECT
  sqlc.embed(users)
FROM follows
  LEFT JOIN users ON users.id = follows.follower_id
WHERE follows.following_id = $1
ORDER BY follows.created_at DESC;

-- name: GetUserFollowing :many
SELECT
  sqlc.embed(users)
FROM follows
  LEFT JOIN users ON users.id = follows.following_id
WHERE follows.follower_id = $1
ORDER BY follows.created_at DESC;

-- name: SearchUserFollowing :many
SELECT
  sqlc.embed(users)
FROM follows
  LEFT JOIN users ON users.id = follows.following_id
WHERE follows.follower_id = $1 AND users.username ILIKE $2
ORDER BY follows.created_at DESC;
