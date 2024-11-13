// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: reviews.sql

package db

import (
	"context"
)

const countPoiReviews = `-- name: CountPoiReviews :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1
`

func (q *Queries) CountPoiReviews(ctx context.Context, poiID string) (int64, error) {
	row := q.db.QueryRow(ctx, countPoiReviews, poiID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const countReviewsByPoiId = `-- name: CountReviewsByPoiId :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1
`

func (q *Queries) CountReviewsByPoiId(ctx context.Context, poiID string) (int64, error) {
	row := q.db.QueryRow(ctx, countReviewsByPoiId, poiID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const countReviewsByUsername = `-- name: CountReviewsByUsername :one
SELECT COUNT(*) FROM reviews
WHERE user_id = (
  SELECT id FROM profile
  WHERE username = $1
)
`

func (q *Queries) CountReviewsByUsername(ctx context.Context, username string) (int64, error) {
	row := q.db.QueryRow(ctx, countReviewsByUsername, username)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createReview = `-- name: CreateReview :one
INSERT INTO reviews (
  id,
  poi_id,
  user_id,
  content,
  rating
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING id, poi_id, user_id, content, rating, created_at, updated_at
`

type CreateReviewParams struct {
	ID      string
	PoiID   string
	UserID  string
	Content string
	Rating  int16
}

func (q *Queries) CreateReview(ctx context.Context, arg CreateReviewParams) (Review, error) {
	row := q.db.QueryRow(ctx, createReview,
		arg.ID,
		arg.PoiID,
		arg.UserID,
		arg.Content,
		arg.Rating,
	)
	var i Review
	err := row.Scan(
		&i.ID,
		&i.PoiID,
		&i.UserID,
		&i.Content,
		&i.Rating,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createReviewMedia = `-- name: CreateReviewMedia :one
INSERT INTO review_media (
  review_id,
  url,
  media_order
) VALUES (
  $1,
  $2,
  $3
) RETURNING id, review_id, url, media_order
`

type CreateReviewMediaParams struct {
	ReviewID   string
	Url        string
	MediaOrder int16
}

func (q *Queries) CreateReviewMedia(ctx context.Context, arg CreateReviewMediaParams) (ReviewMedium, error) {
	row := q.db.QueryRow(ctx, createReviewMedia, arg.ReviewID, arg.Url, arg.MediaOrder)
	var i ReviewMedium
	err := row.Scan(
		&i.ID,
		&i.ReviewID,
		&i.Url,
		&i.MediaOrder,
	)
	return i, err
}

const deleteReview = `-- name: DeleteReview :exec
DELETE FROM reviews
WHERE id = $1
`

func (q *Queries) DeleteReview(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteReview, id)
	return err
}

const getLastMediaOrderOfReview = `-- name: GetLastMediaOrderOfReview :one
SELECT COALESCE(MAX(media_order), 0)
FROM review_media
WHERE review_id = $1
`

func (q *Queries) GetLastMediaOrderOfReview(ctx context.Context, reviewID string) (interface{}, error) {
	row := q.db.QueryRow(ctx, getLastMediaOrderOfReview, reviewID)
	var coalesce interface{}
	err := row.Scan(&coalesce)
	return coalesce, err
}

const getReviewById = `-- name: GetReviewById :one
SELECT
  reviews.id, reviews.poi_id, reviews.user_id, reviews.content, reviews.rating, reviews.created_at, reviews.updated_at,
  profile.id, profile.username, profile.full_name, profile.is_business_account, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.phone, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at
FROM reviews
LEFT JOIN profile ON profile.id = reviews.user_id
LEFT JOIN pois ON reviews.poi_id = pois.id
WHERE reviews.id = $1
LIMIT 1
`

type GetReviewByIdRow struct {
	Review  Review
	Profile Profile
	Poi     Poi
}

func (q *Queries) GetReviewById(ctx context.Context, id string) (GetReviewByIdRow, error) {
	row := q.db.QueryRow(ctx, getReviewById, id)
	var i GetReviewByIdRow
	err := row.Scan(
		&i.Review.ID,
		&i.Review.PoiID,
		&i.Review.UserID,
		&i.Review.Content,
		&i.Review.Rating,
		&i.Review.CreatedAt,
		&i.Review.UpdatedAt,
		&i.Profile.ID,
		&i.Profile.Username,
		&i.Profile.FullName,
		&i.Profile.IsBusinessAccount,
		&i.Profile.IsVerified,
		&i.Profile.Bio,
		&i.Profile.Pronouns,
		&i.Profile.Website,
		&i.Profile.Phone,
		&i.Profile.ProfileImage,
		&i.Profile.BannerImage,
		&i.Profile.FollowersCount,
		&i.Profile.FollowingCount,
		&i.Profile.CreatedAt,
		&i.Poi.ID,
		&i.Poi.Name,
		&i.Poi.Phone,
		&i.Poi.Description,
		&i.Poi.AddressID,
		&i.Poi.Website,
		&i.Poi.PriceLevel,
		&i.Poi.AccessibilityLevel,
		&i.Poi.TotalVotes,
		&i.Poi.TotalPoints,
		&i.Poi.TotalFavorites,
		&i.Poi.CategoryID,
		&i.Poi.OpenTimes,
		&i.Poi.CreatedAt,
		&i.Poi.UpdatedAt,
	)
	return i, err
}

const getReviewMedia = `-- name: GetReviewMedia :many
SELECT id, review_id, url, media_order FROM review_media
WHERE review_id = $1
`

func (q *Queries) GetReviewMedia(ctx context.Context, reviewID string) ([]ReviewMedium, error) {
	rows, err := q.db.Query(ctx, getReviewMedia, reviewID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ReviewMedium
	for rows.Next() {
		var i ReviewMedium
		if err := rows.Scan(
			&i.ID,
			&i.ReviewID,
			&i.Url,
			&i.MediaOrder,
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

const getReviewMediaByReviewIds = `-- name: GetReviewMediaByReviewIds :many
SELECT id, review_id, url, media_order FROM review_media
WHERE review_id = ANY($1::TEXT[])
`

func (q *Queries) GetReviewMediaByReviewIds(ctx context.Context, dollar_1 []string) ([]ReviewMedium, error) {
	rows, err := q.db.Query(ctx, getReviewMediaByReviewIds, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ReviewMedium
	for rows.Next() {
		var i ReviewMedium
		if err := rows.Scan(
			&i.ID,
			&i.ReviewID,
			&i.Url,
			&i.MediaOrder,
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

const getReviewsByPoiId = `-- name: GetReviewsByPoiId :many
SELECT 
  reviews.id, reviews.poi_id, reviews.user_id, reviews.content, reviews.rating, reviews.created_at, reviews.updated_at,
  profile.id, profile.username, profile.full_name, profile.is_business_account, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.phone, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at
FROM 
    reviews
JOIN 
    profile ON reviews.user_id = profile.id
JOIN 
    pois ON reviews.poi_id = pois.id
WHERE reviews.poi_id = $1
ORDER BY reviews.created_at DESC
OFFSET $2
LIMIT $3
`

type GetReviewsByPoiIdParams struct {
	PoiID  string
	Offset int32
	Limit  int32
}

type GetReviewsByPoiIdRow struct {
	Review  Review
	Profile Profile
	Poi     Poi
}

func (q *Queries) GetReviewsByPoiId(ctx context.Context, arg GetReviewsByPoiIdParams) ([]GetReviewsByPoiIdRow, error) {
	rows, err := q.db.Query(ctx, getReviewsByPoiId, arg.PoiID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetReviewsByPoiIdRow
	for rows.Next() {
		var i GetReviewsByPoiIdRow
		if err := rows.Scan(
			&i.Review.ID,
			&i.Review.PoiID,
			&i.Review.UserID,
			&i.Review.Content,
			&i.Review.Rating,
			&i.Review.CreatedAt,
			&i.Review.UpdatedAt,
			&i.Profile.ID,
			&i.Profile.Username,
			&i.Profile.FullName,
			&i.Profile.IsBusinessAccount,
			&i.Profile.IsVerified,
			&i.Profile.Bio,
			&i.Profile.Pronouns,
			&i.Profile.Website,
			&i.Profile.Phone,
			&i.Profile.ProfileImage,
			&i.Profile.BannerImage,
			&i.Profile.FollowersCount,
			&i.Profile.FollowingCount,
			&i.Profile.CreatedAt,
			&i.Poi.ID,
			&i.Poi.Name,
			&i.Poi.Phone,
			&i.Poi.Description,
			&i.Poi.AddressID,
			&i.Poi.Website,
			&i.Poi.PriceLevel,
			&i.Poi.AccessibilityLevel,
			&i.Poi.TotalVotes,
			&i.Poi.TotalPoints,
			&i.Poi.TotalFavorites,
			&i.Poi.CategoryID,
			&i.Poi.OpenTimes,
			&i.Poi.CreatedAt,
			&i.Poi.UpdatedAt,
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

const getReviewsByUsername = `-- name: GetReviewsByUsername :many
SELECT 
  reviews.id, reviews.poi_id, reviews.user_id, reviews.content, reviews.rating, reviews.created_at, reviews.updated_at,
  profile.id, profile.username, profile.full_name, profile.is_business_account, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.phone, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at
FROM 
    reviews
JOIN 
    profile ON reviews.user_id = profile.id
JOIN 
    pois ON reviews.poi_id = pois.id
WHERE profile.username = $1
ORDER BY reviews.created_at DESC
OFFSET $2
LIMIT $3
`

type GetReviewsByUsernameParams struct {
	Username string
	Offset   int32
	Limit    int32
}

type GetReviewsByUsernameRow struct {
	Review  Review
	Profile Profile
	Poi     Poi
}

func (q *Queries) GetReviewsByUsername(ctx context.Context, arg GetReviewsByUsernameParams) ([]GetReviewsByUsernameRow, error) {
	rows, err := q.db.Query(ctx, getReviewsByUsername, arg.Username, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetReviewsByUsernameRow
	for rows.Next() {
		var i GetReviewsByUsernameRow
		if err := rows.Scan(
			&i.Review.ID,
			&i.Review.PoiID,
			&i.Review.UserID,
			&i.Review.Content,
			&i.Review.Rating,
			&i.Review.CreatedAt,
			&i.Review.UpdatedAt,
			&i.Profile.ID,
			&i.Profile.Username,
			&i.Profile.FullName,
			&i.Profile.IsBusinessAccount,
			&i.Profile.IsVerified,
			&i.Profile.Bio,
			&i.Profile.Pronouns,
			&i.Profile.Website,
			&i.Profile.Phone,
			&i.Profile.ProfileImage,
			&i.Profile.BannerImage,
			&i.Profile.FollowersCount,
			&i.Profile.FollowingCount,
			&i.Profile.CreatedAt,
			&i.Poi.ID,
			&i.Poi.Name,
			&i.Poi.Phone,
			&i.Poi.Description,
			&i.Poi.AddressID,
			&i.Poi.Website,
			&i.Poi.PriceLevel,
			&i.Poi.AccessibilityLevel,
			&i.Poi.TotalVotes,
			&i.Poi.TotalPoints,
			&i.Poi.TotalFavorites,
			&i.Poi.CategoryID,
			&i.Poi.OpenTimes,
			&i.Poi.CreatedAt,
			&i.Poi.UpdatedAt,
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

const lastReviewOfUserForPoi = `-- name: LastReviewOfUserForPoi :one
SELECT id, poi_id, user_id, content, rating, created_at, updated_at FROM reviews
WHERE poi_id = $1 AND user_id = $2
ORDER BY created_at DESC
LIMIT 1
`

type LastReviewOfUserForPoiParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) LastReviewOfUserForPoi(ctx context.Context, arg LastReviewOfUserForPoiParams) (Review, error) {
	row := q.db.QueryRow(ctx, lastReviewOfUserForPoi, arg.PoiID, arg.UserID)
	var i Review
	err := row.Scan(
		&i.ID,
		&i.PoiID,
		&i.UserID,
		&i.Content,
		&i.Rating,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const setPreviousReviewRatings = `-- name: SetPreviousReviewRatings :exec
UPDATE reviews
SET rating = $3
WHERE poi_id = $1 AND user_id = $2
`

type SetPreviousReviewRatingsParams struct {
	PoiID  string
	UserID string
	Rating int16
}

func (q *Queries) SetPreviousReviewRatings(ctx context.Context, arg SetPreviousReviewRatingsParams) error {
	_, err := q.db.Exec(ctx, setPreviousReviewRatings, arg.PoiID, arg.UserID, arg.Rating)
	return err
}

const userReviewCountForPoi = `-- name: UserReviewCountForPoi :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1 AND user_id = $2
`

type UserReviewCountForPoiParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) UserReviewCountForPoi(ctx context.Context, arg UserReviewCountForPoiParams) (int64, error) {
	row := q.db.QueryRow(ctx, userReviewCountForPoi, arg.PoiID, arg.UserID)
	var count int64
	err := row.Scan(&count)
	return count, err
}
