// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: diaries.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

type BatchCreateDiaryLocationsParams struct {
	DiaryID     string
	PoiID       string
	Description pgtype.Text
	Index       int32
}

type BatchCreateDiaryUsersParams struct {
	DiaryID string
	UserID  string
	Index   int32
}

const countDiaries = `-- name: CountDiaries :one
SELECT COUNT(*) FROM diaries
WHERE user_id = $1
`

func (q *Queries) CountDiaries(ctx context.Context, userID string) (int64, error) {
	row := q.db.QueryRow(ctx, countDiaries, userID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const countDiariesFilterByRange = `-- name: CountDiariesFilterByRange :one
SELECT COUNT(*) FROM diaries
WHERE user_id = $1 AND date <= $2 AND date >= $3
`

type CountDiariesFilterByRangeParams struct {
	UserID string
	Date   pgtype.Timestamptz
	Date_2 pgtype.Timestamptz
}

func (q *Queries) CountDiariesFilterByRange(ctx context.Context, arg CountDiariesFilterByRangeParams) (int64, error) {
	row := q.db.QueryRow(ctx, countDiariesFilterByRange, arg.UserID, arg.Date, arg.Date_2)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createDiaryImage = `-- name: CreateDiaryImage :one
INSERT INTO diary_images (
  diary_id,
  url,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING id, diary_id, url, index, created_at
`

type CreateDiaryImageParams struct {
	DiaryID string
	Url     string
	Index   int16
}

func (q *Queries) CreateDiaryImage(ctx context.Context, arg CreateDiaryImageParams) (DiaryImage, error) {
	row := q.db.QueryRow(ctx, createDiaryImage, arg.DiaryID, arg.Url, arg.Index)
	var i DiaryImage
	err := row.Scan(
		&i.ID,
		&i.DiaryID,
		&i.Url,
		&i.Index,
		&i.CreatedAt,
	)
	return i, err
}

const createNewDiary = `-- name: CreateNewDiary :one
INSERT INTO diaries (
  id,
  user_id,
  title,
  description,
  share_with_friends,
  date
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING id, user_id, title, description, share_with_friends, date, created_at, updated_at
`

type CreateNewDiaryParams struct {
	ID               string
	UserID           string
	Title            string
	Description      string
	ShareWithFriends bool
	Date             pgtype.Timestamptz
}

func (q *Queries) CreateNewDiary(ctx context.Context, arg CreateNewDiaryParams) (Diary, error) {
	row := q.db.QueryRow(ctx, createNewDiary,
		arg.ID,
		arg.UserID,
		arg.Title,
		arg.Description,
		arg.ShareWithFriends,
		arg.Date,
	)
	var i Diary
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Title,
		&i.Description,
		&i.ShareWithFriends,
		&i.Date,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteDiary = `-- name: DeleteDiary :exec
DELETE FROM diaries
WHERE id = $1
`

func (q *Queries) DeleteDiary(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteDiary, id)
	return err
}

const getDiaries = `-- name: GetDiaries :many
SELECT 
  diaries.id, diaries.user_id, diaries.title, diaries.description, diaries.share_with_friends, diaries.date, diaries.created_at, diaries.updated_at, 
  jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  ) AS owner,
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'id', friend.id,
    'fullName', friend.full_name,
    'username', friend.username,
    'profileImage', friend.profile_image
  ))
  FROM diary_users du
  JOIN profile friend ON friend.id = du.user_id
  WHERE du.diary_id = diaries.id
  ) AS friends,
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'id', di.id,
    'diaryId', di.diary_id,
    'url', di.url,
    'index', di.index,
    'createdAt', di.created_at
  ))
  FROM diary_images di
  WHERE di.diary_id = diaries.id
  ) AS images,
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'diaryId', dp.diary_id,
    'poiId', dp.poi_id,
    'description', dp.description,
    'index', dp.index
  ))
  FROM diary_pois dp
  WHERE dp.diary_id = diaries.id
  ) AS locations,
  (SELECT get_pois(ARRAY(SELECT DISTINCT poi_id FROM diary_pois WHERE diary_id = diaries.id))) AS pois
FROM diaries
LEFT JOIN 
  users u ON diaries.user_id = u.id
WHERE diaries.id = ANY($1::TEXT[])
GROUP BY diaries.id, u.id
`

type GetDiariesRow struct {
	Diary     Diary
	Owner     []byte
	Friends   []byte
	Images    []byte
	Locations []byte
	Pois      []byte
}

func (q *Queries) GetDiaries(ctx context.Context, dollar_1 []string) ([]GetDiariesRow, error) {
	rows, err := q.db.Query(ctx, getDiaries, dollar_1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetDiariesRow
	for rows.Next() {
		var i GetDiariesRow
		if err := rows.Scan(
			&i.Diary.ID,
			&i.Diary.UserID,
			&i.Diary.Title,
			&i.Diary.Description,
			&i.Diary.ShareWithFriends,
			&i.Diary.Date,
			&i.Diary.CreatedAt,
			&i.Diary.UpdatedAt,
			&i.Owner,
			&i.Friends,
			&i.Images,
			&i.Locations,
			&i.Pois,
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

const getDiaryLastImageIndex = `-- name: GetDiaryLastImageIndex :one
SELECT COALESCE(MAX(index), 0)
FROM diary_images
WHERE diary_id = $1
`

func (q *Queries) GetDiaryLastImageIndex(ctx context.Context, diaryID string) (interface{}, error) {
	row := q.db.QueryRow(ctx, getDiaryLastImageIndex, diaryID)
	var coalesce interface{}
	err := row.Scan(&coalesce)
	return coalesce, err
}

const getDiaryPois = `-- name: GetDiaryPois :many
SELECT diary_id, poi_id, description, index
FROM diary_pois
WHERE diary_pois.diary_id = $1
ORDER BY diary_pois.index ASC
`

func (q *Queries) GetDiaryPois(ctx context.Context, diaryID string) ([]DiaryPoi, error) {
	rows, err := q.db.Query(ctx, getDiaryPois, diaryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []DiaryPoi
	for rows.Next() {
		var i DiaryPoi
		if err := rows.Scan(
			&i.DiaryID,
			&i.PoiID,
			&i.Description,
			&i.Index,
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

const getDiaryUsers = `-- name: GetDiaryUsers :many
SELECT 
  diary_users.diary_id, diary_users.user_id, diary_users.index,
  profile.id, profile.username, profile.full_name, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at
FROM diary_users
JOIN profile ON diary_users.user_id = profile.id
WHERE diary_users.diary_id = $1
ORDER BY diary_users.index ASC
`

type GetDiaryUsersRow struct {
	DiaryUser DiaryUser
	Profile   Profile
}

func (q *Queries) GetDiaryUsers(ctx context.Context, diaryID string) ([]GetDiaryUsersRow, error) {
	rows, err := q.db.Query(ctx, getDiaryUsers, diaryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetDiaryUsersRow
	for rows.Next() {
		var i GetDiaryUsersRow
		if err := rows.Scan(
			&i.DiaryUser.DiaryID,
			&i.DiaryUser.UserID,
			&i.DiaryUser.Index,
			&i.Profile.ID,
			&i.Profile.Username,
			&i.Profile.FullName,
			&i.Profile.IsVerified,
			&i.Profile.Bio,
			&i.Profile.Pronouns,
			&i.Profile.Website,
			&i.Profile.ProfileImage,
			&i.Profile.BannerImage,
			&i.Profile.FollowersCount,
			&i.Profile.FollowingCount,
			&i.Profile.CreatedAt,
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

const listAndFilterDiaries = `-- name: ListAndFilterDiaries :many
SELECT id, user_id, title, description, share_with_friends, date, created_at, updated_at FROM diaries
WHERE user_id = $1 AND date <= $2 AND date >= $3
ORDER BY date DESC, created_at DESC
OFFSET $4
LIMIT $5
`

type ListAndFilterDiariesParams struct {
	UserID string
	Date   pgtype.Timestamptz
	Date_2 pgtype.Timestamptz
	Offset int32
	Limit  int32
}

func (q *Queries) ListAndFilterDiaries(ctx context.Context, arg ListAndFilterDiariesParams) ([]Diary, error) {
	rows, err := q.db.Query(ctx, listAndFilterDiaries,
		arg.UserID,
		arg.Date,
		arg.Date_2,
		arg.Offset,
		arg.Limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Diary
	for rows.Next() {
		var i Diary
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Description,
			&i.ShareWithFriends,
			&i.Date,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const listDiaries = `-- name: ListDiaries :many
SELECT id, user_id, title, description, share_with_friends, date, created_at, updated_at FROM diaries
WHERE user_id = $1
ORDER BY date DESC, created_at DESC
OFFSET $2
LIMIT $3
`

type ListDiariesParams struct {
	UserID string
	Offset int32
	Limit  int32
}

func (q *Queries) ListDiaries(ctx context.Context, arg ListDiariesParams) ([]Diary, error) {
	rows, err := q.db.Query(ctx, listDiaries, arg.UserID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Diary
	for rows.Next() {
		var i Diary
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Description,
			&i.ShareWithFriends,
			&i.Date,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const removeDiaryAllImages = `-- name: RemoveDiaryAllImages :exec
DELETE FROM
  diary_images
WHERE
  diary_id = $1
`

func (q *Queries) RemoveDiaryAllImages(ctx context.Context, diaryID string) error {
	_, err := q.db.Exec(ctx, removeDiaryAllImages, diaryID)
	return err
}

const removeDiaryFriends = `-- name: RemoveDiaryFriends :exec
DELETE FROM 
  diary_users
WHERE
  diary_id = $1
`

func (q *Queries) RemoveDiaryFriends(ctx context.Context, diaryID string) error {
	_, err := q.db.Exec(ctx, removeDiaryFriends, diaryID)
	return err
}

const removeDiaryLocations = `-- name: RemoveDiaryLocations :exec
DELETE FROM 
  diary_pois
WHERE
  diary_id = $1
`

func (q *Queries) RemoveDiaryLocations(ctx context.Context, diaryID string) error {
	_, err := q.db.Exec(ctx, removeDiaryLocations, diaryID)
	return err
}

const updateDiary = `-- name: UpdateDiary :one
UPDATE diaries
SET
  title = $2,
  description = $3,
  date = $4,
  share_with_friends = $5
WHERE id = $1
RETURNING id, user_id, title, description, share_with_friends, date, created_at, updated_at
`

type UpdateDiaryParams struct {
	ID               string
	Title            string
	Description      string
	Date             pgtype.Timestamptz
	ShareWithFriends bool
}

func (q *Queries) UpdateDiary(ctx context.Context, arg UpdateDiaryParams) (Diary, error) {
	row := q.db.QueryRow(ctx, updateDiary,
		arg.ID,
		arg.Title,
		arg.Description,
		arg.Date,
		arg.ShareWithFriends,
	)
	var i Diary
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Title,
		&i.Description,
		&i.ShareWithFriends,
		&i.Date,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
