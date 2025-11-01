-- name: FindUserByEmail :one
SELECT *
FROM users
WHERE email = $1
LIMIT 1;

-- name: FindUserById :one
SELECT *
FROM users
WHERE id = $1
LIMIT 1;

-- name: FindUserByUsername :one
SELECT *
FROM users
WHERE username = $1
LIMIT 1;

-- name: FindUserByGoogleId :one
SELECT *
FROM users
WHERE google_id = $1
LIMIT 1;

-- name: FindUserByFbId :one
SELECT *
FROM users
WHERE fb_id = $1
LIMIT 1;

-- name: UpdateUserGoogleId :execresult
UPDATE users
SET google_id = $2
WHERE id = $1;

-- name: UpdateUserFbId :execresult
UPDATE users
SET fb_id = $2
WHERE id = $1;

-- name: UpdateUserPassword :execresult
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

-- name: FindProfileByUsername :one
SELECT *
FROM profile
WHERE username = $1
LIMIT 1;

-- name: IsAdmin :one
SELECT EXISTS (
  SELECT 1
  FROM admins
  WHERE user_id = $1
);

-- name: UpdateUserIsVerified :execresult
UPDATE users
SET is_verified = $2
WHERE id = $1;

-- name: UpdateUserProfile :execresult
UPDATE users
SET
  full_name = $2,
  bio = $3
WHERE id = $1;

-- name: UpdateUserProfileImage :execresult
UPDATE users
SET profile_image = $2
WHERE id = $1;

-- name: UpdateUserBannerImage :execresult
UPDATE users
SET banner_image = $2
WHERE id = $1;

-- name: IncrementUserFollowers :execresult
UPDATE users
SET followers_count = followers_count + 1
WHERE id = $1;

-- name: DecrementUserFollowers :execresult
UPDATE users
SET followers_count = followers_count - 1
WHERE id = $1;

-- name: IncrementUserFollowing :execresult
UPDATE users
SET following_count = following_count + 1
WHERE id = $1;

-- name: DecrementUserFollowing :execresult
UPDATE users
SET following_count = following_count - 1
WHERE id = $1;

-- name: UpdateUserFollowersCount :execresult
UPDATE users
SET followers_count = $2
WHERE id = $1;

-- name: UpdateUserFollowingCount :execresult
UPDATE users
SET following_count = $2
WHERE id = $1;

-- name: FindManyUserTopPlaces :many
SELECT *
FROM user_top_places
WHERE user_id = $1
ORDER BY index ASC;

-- name: RemoveUserTopPlacesByUserId :execresult
DELETE FROM user_top_places
WHERE user_id = $1;

-- name: CreateUserTopPlace :one
INSERT INTO user_top_places (
  user_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;
