-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;

-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByGoogleId :one
SELECT * FROM users
WHERE google_id = $1 LIMIT 1;

-- name: GetUserByFbId :one
SELECT * FROM users
WHERE fb_id = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1 LIMIT 1;

-- name: UpdateUserGoogleId :exec
UPDATE users
SET google_id = $2
WHERE id = $1;

-- name: UpdateUserFbId :exec
UPDATE users
SET fb_id = $2
WHERE id = $1;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2
WHERE id = $1;

-- name: CreateUser :one
INSERT INTO users (
  id,
  email,
  username,
  full_name,
  password_hash,
  google_id,
  fb_id,
  profile_image
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
) RETURNING *;

-- name: BatchCreateUsers :copyfrom
INSERT INTO users (
  id,
  email,
  username,
  full_name,
  password_hash,
  google_id,
  fb_id,
  profile_image
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
);

-- name: GetUserProfileByUsername :one
SELECT *
FROM profile
WHERE username = $1 LIMIT 1;

-- name: IsAdmin :one
SELECT EXISTS (
  SELECT 1
  FROM admins
  WHERE user_id = $1
);

-- name: MakeUserVerified :exec
UPDATE users
SET is_verified = true
WHERE id = $1;

-- name: UpdateUserProfile :one
UPDATE users
SET
  full_name = $2,
  bio = $3,
  pronouns = $4,
  website = $5
WHERE id = $1
RETURNING *;

-- name: UpdateUserProfileImage :exec
UPDATE users
SET profile_image = $2
WHERE id = $1;

-- name: UpdateUserBannerImage :exec
UPDATE users
SET banner_image = $2
WHERE id = $1;

-- name: IncrUserFollowers :exec
UPDATE users
SET followers_count = followers_count + 1
WHERE id = $1;

-- name: DecrUserFollowers :exec
UPDATE users
SET followers_count = followers_count - 1
WHERE id = $1;

-- name: IncrUserFollowing :exec
UPDATE users
SET following_count = following_count + 1
WHERE id = $1;

-- name: DecrUserFollowing :exec
UPDATE users
SET following_count = following_count - 1
WHERE id = $1;

-- name: SetFollowersCount :exec
UPDATE users
SET followers_count = $2
WHERE id = $1;

-- name: SetFollowingCount :exec
UPDATE users
SET following_count = $2
WHERE id = $1;

-- name: GetUserTopPois :many
SELECT * FROM user_top_pois
WHERE user_id = $1
ORDER BY index ASC;

-- name: DeleteUserAllTopPois :exec
DELETE FROM user_top_pois
WHERE user_id = $1;

-- name: CreateUserTopPoi :one
INSERT INTO user_top_pois (
  user_id,
  poi_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;
