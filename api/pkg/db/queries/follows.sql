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

-- name: BatchFollow :copyfrom
INSERT INTO follows (
  follower_id,
  following_id
) VALUES (
  $1,
  $2
);

-- name: GetFollowersCount :one
SELECT COUNT(*) FROM follows
WHERE following_id = $1;

-- name: GetFollowingCount :one
SELECT COUNT(*) FROM follows
WHERE follower_id = $1;

-- name: Unfollow :exec
DELETE FROM follows
WHERE follower_id = $1 AND following_id = $2;

-- name: GetUserFollowers :many
SELECT
  sqlc.embed(profile)
FROM follows
  LEFT JOIN profile ON profile.id = follows.follower_id
WHERE follows.following_id = $1
ORDER BY follows.created_at DESC;

-- name: GetUserFollowing :many
SELECT
  sqlc.embed(profile)
FROM follows
  LEFT JOIN profile ON profile.id = follows.following_id
WHERE follows.follower_id = $1
ORDER BY follows.created_at DESC;

-- name: SearchUserFollowing :many
SELECT
  sqlc.embed(profile)
FROM follows
  LEFT JOIN profile ON profile.id = follows.following_id
WHERE follows.follower_id = $1 AND profile.username ILIKE $2
ORDER BY follows.created_at DESC
LIMIT 25;
