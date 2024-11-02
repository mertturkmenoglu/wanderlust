// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: diaries.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const changeShareWithFriends = `-- name: ChangeShareWithFriends :exec
UPDATE diary_entries
SET share_with_friends = not share_with_friends
WHERE id = $1
`

func (q *Queries) ChangeShareWithFriends(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, changeShareWithFriends, id)
	return err
}

const createDiaryEntryPoi = `-- name: CreateDiaryEntryPoi :one
INSERT INTO diary_entries_pois (
  diary_entry_id,
  poi_id,
  description,
  list_index
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING diary_entry_id, poi_id, description, list_index
`

type CreateDiaryEntryPoiParams struct {
	DiaryEntryID string
	PoiID        string
	Description  pgtype.Text
	ListIndex    int32
}

func (q *Queries) CreateDiaryEntryPoi(ctx context.Context, arg CreateDiaryEntryPoiParams) (DiaryEntriesPoi, error) {
	row := q.db.QueryRow(ctx, createDiaryEntryPoi,
		arg.DiaryEntryID,
		arg.PoiID,
		arg.Description,
		arg.ListIndex,
	)
	var i DiaryEntriesPoi
	err := row.Scan(
		&i.DiaryEntryID,
		&i.PoiID,
		&i.Description,
		&i.ListIndex,
	)
	return i, err
}

const createDiaryEntryUser = `-- name: CreateDiaryEntryUser :one
INSERT INTO diary_entries_users (
  diary_entry_id,
  user_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
) RETURNING diary_entry_id, user_id, list_index
`

type CreateDiaryEntryUserParams struct {
	DiaryEntryID string
	UserID       string
	ListIndex    int32
}

func (q *Queries) CreateDiaryEntryUser(ctx context.Context, arg CreateDiaryEntryUserParams) (DiaryEntriesUser, error) {
	row := q.db.QueryRow(ctx, createDiaryEntryUser, arg.DiaryEntryID, arg.UserID, arg.ListIndex)
	var i DiaryEntriesUser
	err := row.Scan(&i.DiaryEntryID, &i.UserID, &i.ListIndex)
	return i, err
}

const createDiaryMedia = `-- name: CreateDiaryMedia :one
INSERT INTO diary_media (
  diary_entry_id,
  url,
  alt,
  caption,
  media_order
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING id, diary_entry_id, url, alt, caption, media_order, created_at
`

type CreateDiaryMediaParams struct {
	DiaryEntryID string
	Url          string
	Alt          string
	Caption      pgtype.Text
	MediaOrder   int16
}

func (q *Queries) CreateDiaryMedia(ctx context.Context, arg CreateDiaryMediaParams) (DiaryMedium, error) {
	row := q.db.QueryRow(ctx, createDiaryMedia,
		arg.DiaryEntryID,
		arg.Url,
		arg.Alt,
		arg.Caption,
		arg.MediaOrder,
	)
	var i DiaryMedium
	err := row.Scan(
		&i.ID,
		&i.DiaryEntryID,
		&i.Url,
		&i.Alt,
		&i.Caption,
		&i.MediaOrder,
		&i.CreatedAt,
	)
	return i, err
}

const createNewDiaryEntry = `-- name: CreateNewDiaryEntry :one
INSERT INTO diary_entries (
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

type CreateNewDiaryEntryParams struct {
	ID               string
	UserID           string
	Title            string
	Description      string
	ShareWithFriends bool
	Date             pgtype.Timestamptz
}

func (q *Queries) CreateNewDiaryEntry(ctx context.Context, arg CreateNewDiaryEntryParams) (DiaryEntry, error) {
	row := q.db.QueryRow(ctx, createNewDiaryEntry,
		arg.ID,
		arg.UserID,
		arg.Title,
		arg.Description,
		arg.ShareWithFriends,
		arg.Date,
	)
	var i DiaryEntry
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

const deleteDiaryEntry = `-- name: DeleteDiaryEntry :exec
DELETE FROM diary_entries
WHERE id = $1
`

func (q *Queries) DeleteDiaryEntry(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteDiaryEntry, id)
	return err
}

const getDiaryEntryById = `-- name: GetDiaryEntryById :one
SELECT 
  diary_entries.id, diary_entries.user_id, diary_entries.title, diary_entries.description, diary_entries.share_with_friends, diary_entries.date, diary_entries.created_at, diary_entries.updated_at, 
  profile.id, profile.username, profile.full_name, profile.is_business_account, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.phone, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at
FROM diary_entries
  LEFT JOIN profile ON diary_entries.user_id = profile.id
WHERE diary_entries.id = $1 LIMIT 1
`

type GetDiaryEntryByIdRow struct {
	DiaryEntry DiaryEntry
	Profile    Profile
}

func (q *Queries) GetDiaryEntryById(ctx context.Context, id string) (GetDiaryEntryByIdRow, error) {
	row := q.db.QueryRow(ctx, getDiaryEntryById, id)
	var i GetDiaryEntryByIdRow
	err := row.Scan(
		&i.DiaryEntry.ID,
		&i.DiaryEntry.UserID,
		&i.DiaryEntry.Title,
		&i.DiaryEntry.Description,
		&i.DiaryEntry.ShareWithFriends,
		&i.DiaryEntry.Date,
		&i.DiaryEntry.CreatedAt,
		&i.DiaryEntry.UpdatedAt,
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
	)
	return i, err
}

const getDiaryEntryPois = `-- name: GetDiaryEntryPois :many
SELECT 
  diary_entries_pois.diary_entry_id, diary_entries_pois.poi_id, diary_entries_pois.description, diary_entries_pois.list_index,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at,
  categories.id, categories.name, categories.image,
  addresses.id, addresses.city_id, addresses.line1, addresses.line2, addresses.postal_code, addresses.lat, addresses.lng,
  cities.id, cities.name, cities.state_code, cities.state_name, cities.country_code, cities.country_name, cities.image_url, cities.latitude, cities.longitude, cities.description, cities.img_license, cities.img_license_link, cities.img_attr, cities.img_attr_link,
  media.id, media.poi_id, media.url, media.alt, media.caption, media.media_order, media.created_at
FROM diary_entries_pois
  LEFT JOIN pois ON diary_entries_pois.poi_id = pois.id
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE diary_entries_pois.diary_entry_id = $1 AND media.media_order = 1
ORDER BY diary_entries_pois.list_index ASC
`

type GetDiaryEntryPoisRow struct {
	DiaryEntriesPoi DiaryEntriesPoi
	Poi             Poi
	Category        Category
	Address         Address
	City            City
	Medium          Medium
}

func (q *Queries) GetDiaryEntryPois(ctx context.Context, diaryEntryID string) ([]GetDiaryEntryPoisRow, error) {
	rows, err := q.db.Query(ctx, getDiaryEntryPois, diaryEntryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetDiaryEntryPoisRow
	for rows.Next() {
		var i GetDiaryEntryPoisRow
		if err := rows.Scan(
			&i.DiaryEntriesPoi.DiaryEntryID,
			&i.DiaryEntriesPoi.PoiID,
			&i.DiaryEntriesPoi.Description,
			&i.DiaryEntriesPoi.ListIndex,
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
			&i.Category.ID,
			&i.Category.Name,
			&i.Category.Image,
			&i.Address.ID,
			&i.Address.CityID,
			&i.Address.Line1,
			&i.Address.Line2,
			&i.Address.PostalCode,
			&i.Address.Lat,
			&i.Address.Lng,
			&i.City.ID,
			&i.City.Name,
			&i.City.StateCode,
			&i.City.StateName,
			&i.City.CountryCode,
			&i.City.CountryName,
			&i.City.ImageUrl,
			&i.City.Latitude,
			&i.City.Longitude,
			&i.City.Description,
			&i.City.ImgLicense,
			&i.City.ImgLicenseLink,
			&i.City.ImgAttr,
			&i.City.ImgAttrLink,
			&i.Medium.ID,
			&i.Medium.PoiID,
			&i.Medium.Url,
			&i.Medium.Alt,
			&i.Medium.Caption,
			&i.Medium.MediaOrder,
			&i.Medium.CreatedAt,
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

const getDiaryEntryUsers = `-- name: GetDiaryEntryUsers :many
SELECT 
  diary_entries_users.diary_entry_id, diary_entries_users.user_id, diary_entries_users.list_index,
  profile.id, profile.username, profile.full_name, profile.is_business_account, profile.is_verified, profile.bio, profile.pronouns, profile.website, profile.phone, profile.profile_image, profile.banner_image, profile.followers_count, profile.following_count, profile.created_at
FROM diary_entries_users
  JOIN profile ON diary_entries_users.user_id = profile.id
WHERE diary_entries_users.diary_entry_id = $1
ORDER BY diary_entries_users.list_index ASC
`

type GetDiaryEntryUsersRow struct {
	DiaryEntriesUser DiaryEntriesUser
	Profile          Profile
}

func (q *Queries) GetDiaryEntryUsers(ctx context.Context, diaryEntryID string) ([]GetDiaryEntryUsersRow, error) {
	rows, err := q.db.Query(ctx, getDiaryEntryUsers, diaryEntryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetDiaryEntryUsersRow
	for rows.Next() {
		var i GetDiaryEntryUsersRow
		if err := rows.Scan(
			&i.DiaryEntriesUser.DiaryEntryID,
			&i.DiaryEntriesUser.UserID,
			&i.DiaryEntriesUser.ListIndex,
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

const getDiaryMedia = `-- name: GetDiaryMedia :many
SELECT id, diary_entry_id, url, alt, caption, media_order, created_at FROM diary_media
WHERE diary_entry_id = $1
ORDER BY media_order ASC
`

func (q *Queries) GetDiaryMedia(ctx context.Context, diaryEntryID string) ([]DiaryMedium, error) {
	rows, err := q.db.Query(ctx, getDiaryMedia, diaryEntryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []DiaryMedium
	for rows.Next() {
		var i DiaryMedium
		if err := rows.Scan(
			&i.ID,
			&i.DiaryEntryID,
			&i.Url,
			&i.Alt,
			&i.Caption,
			&i.MediaOrder,
			&i.CreatedAt,
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

const getLastMediaOrderOfEntry = `-- name: GetLastMediaOrderOfEntry :one
SELECT COALESCE(MAX(media_order), 0)
FROM diary_media
WHERE diary_entry_id = $1
`

func (q *Queries) GetLastMediaOrderOfEntry(ctx context.Context, diaryEntryID string) (interface{}, error) {
	row := q.db.QueryRow(ctx, getLastMediaOrderOfEntry, diaryEntryID)
	var coalesce interface{}
	err := row.Scan(&coalesce)
	return coalesce, err
}

const listDiaryEntries = `-- name: ListDiaryEntries :many
SELECT id, user_id, title, description, share_with_friends, date, created_at, updated_at FROM diary_entries
WHERE user_id = $1
ORDER BY date DESC
`

func (q *Queries) ListDiaryEntries(ctx context.Context, userID string) ([]DiaryEntry, error) {
	rows, err := q.db.Query(ctx, listDiaryEntries, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []DiaryEntry
	for rows.Next() {
		var i DiaryEntry
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
