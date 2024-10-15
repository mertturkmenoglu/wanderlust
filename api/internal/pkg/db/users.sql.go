// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

type BatchCreateUsersParams struct {
	ID                    string
	Email                 string
	Username              string
	FullName              string
	PasswordHash          pgtype.Text
	GoogleID              pgtype.Text
	FbID                  pgtype.Text
	IsEmailVerified       bool
	IsOnboardingCompleted bool
	ProfileImage          pgtype.Text
}

const createUser = `-- name: CreateUser :one
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
) RETURNING id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at
`

type CreateUserParams struct {
	ID                    string
	Email                 string
	Username              string
	FullName              string
	PasswordHash          pgtype.Text
	GoogleID              pgtype.Text
	FbID                  pgtype.Text
	IsEmailVerified       bool
	IsOnboardingCompleted bool
	ProfileImage          pgtype.Text
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser,
		arg.ID,
		arg.Email,
		arg.Username,
		arg.FullName,
		arg.PasswordHash,
		arg.GoogleID,
		arg.FbID,
		arg.IsEmailVerified,
		arg.IsOnboardingCompleted,
		arg.ProfileImage,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const decrUserFollowers = `-- name: DecrUserFollowers :exec
UPDATE users
SET followers_count = followers_count - 1
WHERE id = $1
`

func (q *Queries) DecrUserFollowers(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, decrUserFollowers, id)
	return err
}

const decrUserFollowing = `-- name: DecrUserFollowing :exec
UPDATE users
SET following_count = following_count - 1
WHERE id = $1
`

func (q *Queries) DecrUserFollowing(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, decrUserFollowing, id)
	return err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at FROM users
WHERE email = $1 LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByFbId = `-- name: GetUserByFbId :one
SELECT id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at FROM users
WHERE fb_id = $1 LIMIT 1
`

func (q *Queries) GetUserByFbId(ctx context.Context, fbID pgtype.Text) (User, error) {
	row := q.db.QueryRow(ctx, getUserByFbId, fbID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByGoogleId = `-- name: GetUserByGoogleId :one
SELECT id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at FROM users
WHERE google_id = $1 LIMIT 1
`

func (q *Queries) GetUserByGoogleId(ctx context.Context, googleID pgtype.Text) (User, error) {
	row := q.db.QueryRow(ctx, getUserByGoogleId, googleID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserById = `-- name: GetUserById :one
SELECT id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at FROM users
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetUserById(ctx context.Context, id string) (User, error) {
	row := q.db.QueryRow(ctx, getUserById, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByUsername = `-- name: GetUserByUsername :one
SELECT id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at FROM users
WHERE username = $1 LIMIT 1
`

func (q *Queries) GetUserByUsername(ctx context.Context, username string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByUsername, username)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserProfileByUsername = `-- name: GetUserProfileByUsername :one
SELECT 
  id,
  username,
  full_name,
  is_business_account,
  is_verified,
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
WHERE username = $1 LIMIT 1
`

type GetUserProfileByUsernameRow struct {
	ID                string
	Username          string
	FullName          string
	IsBusinessAccount bool
	IsVerified        bool
	Bio               pgtype.Text
	Pronouns          pgtype.Text
	Website           pgtype.Text
	Phone             pgtype.Text
	ProfileImage      pgtype.Text
	BannerImage       pgtype.Text
	FollowersCount    int32
	FollowingCount    int32
	CreatedAt         pgtype.Timestamptz
}

func (q *Queries) GetUserProfileByUsername(ctx context.Context, username string) (GetUserProfileByUsernameRow, error) {
	row := q.db.QueryRow(ctx, getUserProfileByUsername, username)
	var i GetUserProfileByUsernameRow
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.FullName,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.CreatedAt,
	)
	return i, err
}

const incrUserFollowers = `-- name: IncrUserFollowers :exec
UPDATE users
SET followers_count = followers_count + 1
WHERE id = $1
`

func (q *Queries) IncrUserFollowers(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, incrUserFollowers, id)
	return err
}

const incrUserFollowing = `-- name: IncrUserFollowing :exec
UPDATE users
SET following_count = following_count + 1
WHERE id = $1
`

func (q *Queries) IncrUserFollowing(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, incrUserFollowing, id)
	return err
}

const isAdmin = `-- name: IsAdmin :one
SELECT EXISTS (
  SELECT 1
  FROM users
  WHERE id = $1 AND role = 'admin'
)
`

func (q *Queries) IsAdmin(ctx context.Context, id string) (bool, error) {
	row := q.db.QueryRow(ctx, isAdmin, id)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const makeUserVerified = `-- name: MakeUserVerified :exec
UPDATE users
SET is_verified = true
WHERE id = $1
`

func (q *Queries) MakeUserVerified(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, makeUserVerified, id)
	return err
}

const updateUserBannerImage = `-- name: UpdateUserBannerImage :exec
UPDATE users
SET banner_image = $2
WHERE id = $1
`

type UpdateUserBannerImageParams struct {
	ID          string
	BannerImage pgtype.Text
}

func (q *Queries) UpdateUserBannerImage(ctx context.Context, arg UpdateUserBannerImageParams) error {
	_, err := q.db.Exec(ctx, updateUserBannerImage, arg.ID, arg.BannerImage)
	return err
}

const updateUserFbId = `-- name: UpdateUserFbId :exec
UPDATE users
SET fb_id = $2
WHERE id = $1
`

type UpdateUserFbIdParams struct {
	ID   string
	FbID pgtype.Text
}

func (q *Queries) UpdateUserFbId(ctx context.Context, arg UpdateUserFbIdParams) error {
	_, err := q.db.Exec(ctx, updateUserFbId, arg.ID, arg.FbID)
	return err
}

const updateUserGoogleId = `-- name: UpdateUserGoogleId :exec
UPDATE users
SET google_id = $2
WHERE id = $1
`

type UpdateUserGoogleIdParams struct {
	ID       string
	GoogleID pgtype.Text
}

func (q *Queries) UpdateUserGoogleId(ctx context.Context, arg UpdateUserGoogleIdParams) error {
	_, err := q.db.Exec(ctx, updateUserGoogleId, arg.ID, arg.GoogleID)
	return err
}

const updateUserIsEmailVerified = `-- name: UpdateUserIsEmailVerified :exec
UPDATE users
SET is_email_verified = $2
WHERE id = $1
`

type UpdateUserIsEmailVerifiedParams struct {
	ID              string
	IsEmailVerified bool
}

func (q *Queries) UpdateUserIsEmailVerified(ctx context.Context, arg UpdateUserIsEmailVerifiedParams) error {
	_, err := q.db.Exec(ctx, updateUserIsEmailVerified, arg.ID, arg.IsEmailVerified)
	return err
}

const updateUserPassword = `-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2
WHERE id = $1
`

type UpdateUserPasswordParams struct {
	ID           string
	PasswordHash pgtype.Text
}

func (q *Queries) UpdateUserPassword(ctx context.Context, arg UpdateUserPasswordParams) error {
	_, err := q.db.Exec(ctx, updateUserPassword, arg.ID, arg.PasswordHash)
	return err
}

const updateUserProfile = `-- name: UpdateUserProfile :one
UPDATE users
SET
  full_name = $2,
  bio = $3,
  pronouns = $4,
  website = $5,
  phone = $6
WHERE id = $1
RETURNING id, email, username, full_name, password_hash, google_id, fb_id, is_email_verified, is_onboarding_completed, is_active, is_business_account, is_verified, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, bio, pronouns, website, phone, profile_image, banner_image, followers_count, following_count, last_login, created_at, updated_at
`

type UpdateUserProfileParams struct {
	ID       string
	FullName string
	Bio      pgtype.Text
	Pronouns pgtype.Text
	Website  pgtype.Text
	Phone    pgtype.Text
}

func (q *Queries) UpdateUserProfile(ctx context.Context, arg UpdateUserProfileParams) (User, error) {
	row := q.db.QueryRow(ctx, updateUserProfile,
		arg.ID,
		arg.FullName,
		arg.Bio,
		arg.Pronouns,
		arg.Website,
		arg.Phone,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Username,
		&i.FullName,
		&i.PasswordHash,
		&i.GoogleID,
		&i.FbID,
		&i.IsEmailVerified,
		&i.IsOnboardingCompleted,
		&i.IsActive,
		&i.IsBusinessAccount,
		&i.IsVerified,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Bio,
		&i.Pronouns,
		&i.Website,
		&i.Phone,
		&i.ProfileImage,
		&i.BannerImage,
		&i.FollowersCount,
		&i.FollowingCount,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateUserProfileImage = `-- name: UpdateUserProfileImage :exec
UPDATE users
SET profile_image = $2
WHERE id = $1
`

type UpdateUserProfileImageParams struct {
	ID           string
	ProfileImage pgtype.Text
}

func (q *Queries) UpdateUserProfileImage(ctx context.Context, arg UpdateUserProfileImageParams) error {
	_, err := q.db.Exec(ctx, updateUserProfileImage, arg.ID, arg.ProfileImage)
	return err
}
