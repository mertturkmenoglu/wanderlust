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
