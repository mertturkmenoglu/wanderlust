// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, email, username, full_name, password_hash, google_id, is_email_verified, is_active, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, gender, profile_image, last_login, created_at, updated_at FROM users
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
		&i.IsEmailVerified,
		&i.IsActive,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Gender,
		&i.ProfileImage,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByGoogleId = `-- name: GetUserByGoogleId :one
SELECT id, email, username, full_name, password_hash, google_id, is_email_verified, is_active, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, gender, profile_image, last_login, created_at, updated_at FROM users
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
		&i.IsEmailVerified,
		&i.IsActive,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Gender,
		&i.ProfileImage,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserById = `-- name: GetUserById :one
SELECT id, email, username, full_name, password_hash, google_id, is_email_verified, is_active, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, gender, profile_image, last_login, created_at, updated_at FROM users
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
		&i.IsEmailVerified,
		&i.IsActive,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Gender,
		&i.ProfileImage,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByUsername = `-- name: GetUserByUsername :one
SELECT id, email, username, full_name, password_hash, google_id, is_email_verified, is_active, role, password_reset_token, password_reset_expires, login_attempts, lockout_until, gender, profile_image, last_login, created_at, updated_at FROM users
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
		&i.IsEmailVerified,
		&i.IsActive,
		&i.Role,
		&i.PasswordResetToken,
		&i.PasswordResetExpires,
		&i.LoginAttempts,
		&i.LockoutUntil,
		&i.Gender,
		&i.ProfileImage,
		&i.LastLogin,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}