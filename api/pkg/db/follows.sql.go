// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: follows.sql

package db

import (
	"context"
)

type BatchFollowParams struct {
	FollowerID  string
	FollowingID string
}

const follow = `-- name: Follow :exec
INSERT INTO follows (
  follower_id,
  following_id
) VALUES (
  $1,
  $2
)
`

type FollowParams struct {
	FollowerID  string
	FollowingID string
}

func (q *Queries) Follow(ctx context.Context, arg FollowParams) error {
	_, err := q.db.Exec(ctx, follow, arg.FollowerID, arg.FollowingID)
	return err
}

const getFollowersCount = `-- name: GetFollowersCount :one
SELECT COUNT(*) FROM follows
WHERE following_id = $1
`

func (q *Queries) GetFollowersCount(ctx context.Context, followingID string) (int64, error) {
	row := q.db.QueryRow(ctx, getFollowersCount, followingID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getFollowingCount = `-- name: GetFollowingCount :one
SELECT COUNT(*) FROM follows
WHERE follower_id = $1
`

func (q *Queries) GetFollowingCount(ctx context.Context, followerID string) (int64, error) {
	row := q.db.QueryRow(ctx, getFollowingCount, followerID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getUserFollowers = `-- name: GetUserFollowers :many
SELECT
  users.id, users.email, users.username, users.full_name, users.password_hash, users.google_id, users.fb_id, users.is_email_verified, users.is_onboarding_completed, users.is_active, users.is_business_account, users.is_verified, users.role, users.password_reset_token, users.password_reset_expires, users.login_attempts, users.lockout_until, users.bio, users.pronouns, users.website, users.phone, users.profile_image, users.banner_image, users.followers_count, users.following_count, users.last_login, users.created_at, users.updated_at
FROM follows
  LEFT JOIN users ON users.id = follows.follower_id
WHERE follows.following_id = $1
ORDER BY follows.created_at DESC
`

type GetUserFollowersRow struct {
	User User
}

func (q *Queries) GetUserFollowers(ctx context.Context, followingID string) ([]GetUserFollowersRow, error) {
	rows, err := q.db.Query(ctx, getUserFollowers, followingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUserFollowersRow
	for rows.Next() {
		var i GetUserFollowersRow
		if err := rows.Scan(
			&i.User.ID,
			&i.User.Email,
			&i.User.Username,
			&i.User.FullName,
			&i.User.PasswordHash,
			&i.User.GoogleID,
			&i.User.FbID,
			&i.User.IsEmailVerified,
			&i.User.IsOnboardingCompleted,
			&i.User.IsActive,
			&i.User.IsBusinessAccount,
			&i.User.IsVerified,
			&i.User.Role,
			&i.User.PasswordResetToken,
			&i.User.PasswordResetExpires,
			&i.User.LoginAttempts,
			&i.User.LockoutUntil,
			&i.User.Bio,
			&i.User.Pronouns,
			&i.User.Website,
			&i.User.Phone,
			&i.User.ProfileImage,
			&i.User.BannerImage,
			&i.User.FollowersCount,
			&i.User.FollowingCount,
			&i.User.LastLogin,
			&i.User.CreatedAt,
			&i.User.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserFollowing = `-- name: GetUserFollowing :many
SELECT
  users.id, users.email, users.username, users.full_name, users.password_hash, users.google_id, users.fb_id, users.is_email_verified, users.is_onboarding_completed, users.is_active, users.is_business_account, users.is_verified, users.role, users.password_reset_token, users.password_reset_expires, users.login_attempts, users.lockout_until, users.bio, users.pronouns, users.website, users.phone, users.profile_image, users.banner_image, users.followers_count, users.following_count, users.last_login, users.created_at, users.updated_at
FROM follows
  LEFT JOIN users ON users.id = follows.following_id
WHERE follows.follower_id = $1
ORDER BY follows.created_at DESC
`

type GetUserFollowingRow struct {
	User User
}

func (q *Queries) GetUserFollowing(ctx context.Context, followerID string) ([]GetUserFollowingRow, error) {
	rows, err := q.db.Query(ctx, getUserFollowing, followerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUserFollowingRow
	for rows.Next() {
		var i GetUserFollowingRow
		if err := rows.Scan(
			&i.User.ID,
			&i.User.Email,
			&i.User.Username,
			&i.User.FullName,
			&i.User.PasswordHash,
			&i.User.GoogleID,
			&i.User.FbID,
			&i.User.IsEmailVerified,
			&i.User.IsOnboardingCompleted,
			&i.User.IsActive,
			&i.User.IsBusinessAccount,
			&i.User.IsVerified,
			&i.User.Role,
			&i.User.PasswordResetToken,
			&i.User.PasswordResetExpires,
			&i.User.LoginAttempts,
			&i.User.LockoutUntil,
			&i.User.Bio,
			&i.User.Pronouns,
			&i.User.Website,
			&i.User.Phone,
			&i.User.ProfileImage,
			&i.User.BannerImage,
			&i.User.FollowersCount,
			&i.User.FollowingCount,
			&i.User.LastLogin,
			&i.User.CreatedAt,
			&i.User.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const isUserFollowing = `-- name: IsUserFollowing :one
SELECT EXISTS (
  SELECT 1
  FROM follows
  WHERE follower_id = $1 AND following_id = $2
)
`

type IsUserFollowingParams struct {
	FollowerID  string
	FollowingID string
}

func (q *Queries) IsUserFollowing(ctx context.Context, arg IsUserFollowingParams) (bool, error) {
	row := q.db.QueryRow(ctx, isUserFollowing, arg.FollowerID, arg.FollowingID)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const searchUserFollowing = `-- name: SearchUserFollowing :many
SELECT
  users.id, users.email, users.username, users.full_name, users.password_hash, users.google_id, users.fb_id, users.is_email_verified, users.is_onboarding_completed, users.is_active, users.is_business_account, users.is_verified, users.role, users.password_reset_token, users.password_reset_expires, users.login_attempts, users.lockout_until, users.bio, users.pronouns, users.website, users.phone, users.profile_image, users.banner_image, users.followers_count, users.following_count, users.last_login, users.created_at, users.updated_at
FROM follows
  LEFT JOIN users ON users.id = follows.following_id
WHERE follows.follower_id = $1 AND users.username ILIKE $2
ORDER BY follows.created_at DESC
LIMIT 25
`

type SearchUserFollowingParams struct {
	FollowerID string
	Username   string
}

type SearchUserFollowingRow struct {
	User User
}

func (q *Queries) SearchUserFollowing(ctx context.Context, arg SearchUserFollowingParams) ([]SearchUserFollowingRow, error) {
	rows, err := q.db.Query(ctx, searchUserFollowing, arg.FollowerID, arg.Username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SearchUserFollowingRow
	for rows.Next() {
		var i SearchUserFollowingRow
		if err := rows.Scan(
			&i.User.ID,
			&i.User.Email,
			&i.User.Username,
			&i.User.FullName,
			&i.User.PasswordHash,
			&i.User.GoogleID,
			&i.User.FbID,
			&i.User.IsEmailVerified,
			&i.User.IsOnboardingCompleted,
			&i.User.IsActive,
			&i.User.IsBusinessAccount,
			&i.User.IsVerified,
			&i.User.Role,
			&i.User.PasswordResetToken,
			&i.User.PasswordResetExpires,
			&i.User.LoginAttempts,
			&i.User.LockoutUntil,
			&i.User.Bio,
			&i.User.Pronouns,
			&i.User.Website,
			&i.User.Phone,
			&i.User.ProfileImage,
			&i.User.BannerImage,
			&i.User.FollowersCount,
			&i.User.FollowingCount,
			&i.User.LastLogin,
			&i.User.CreatedAt,
			&i.User.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const unfollow = `-- name: Unfollow :exec
DELETE FROM follows
WHERE follower_id = $1 AND following_id = $2
`

type UnfollowParams struct {
	FollowerID  string
	FollowingID string
}

func (q *Queries) Unfollow(ctx context.Context, arg UnfollowParams) error {
	_, err := q.db.Exec(ctx, unfollow, arg.FollowerID, arg.FollowingID)
	return err
}
