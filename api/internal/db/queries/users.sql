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

-- name: UpdateUserIsEmailVerified :exec
UPDATE users
SET is_email_verified = $2
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
  is_email_verified,
  is_onboarding_completed,
  profile_image
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10
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
  is_email_verified,
  is_onboarding_completed,
  profile_image
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10
);

-- name: GetUserProfileByUsername :one
SELECT 
  id,
  username,
  full_name,
  is_business_account,
  is_verified,
  gender,
  bio,
  pronouns,
  website,
  phone,
  profile_image,
  banner_image,
  followers_count,
  following_count,
  created_at
FROM users
WHERE username = $1 LIMIT 1;
