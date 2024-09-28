// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: bookmarks.sql

package db

import (
	"context"
)

const countUserBookmarks = `-- name: CountUserBookmarks :one
SELECT COUNT(*) FROM bookmarks
WHERE user_id = $1
`

func (q *Queries) CountUserBookmarks(ctx context.Context, userID string) (int64, error) {
	row := q.db.QueryRow(ctx, countUserBookmarks, userID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createBookmark = `-- name: CreateBookmark :one
INSERT INTO bookmarks (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
)
RETURNING id, poi_id, user_id, created_at
`

type CreateBookmarkParams struct {
	UserID string
	PoiID  string
}

func (q *Queries) CreateBookmark(ctx context.Context, arg CreateBookmarkParams) (Bookmark, error) {
	row := q.db.QueryRow(ctx, createBookmark, arg.UserID, arg.PoiID)
	var i Bookmark
	err := row.Scan(
		&i.ID,
		&i.PoiID,
		&i.UserID,
		&i.CreatedAt,
	)
	return i, err
}

const deleteBookmarkByPoiId = `-- name: DeleteBookmarkByPoiId :exec
DELETE FROM bookmarks
WHERE poi_id = $1 AND user_id = $2
`

type DeleteBookmarkByPoiIdParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) DeleteBookmarkByPoiId(ctx context.Context, arg DeleteBookmarkByPoiIdParams) error {
	_, err := q.db.Exec(ctx, deleteBookmarkByPoiId, arg.PoiID, arg.UserID)
	return err
}

const getBookmarkById = `-- name: GetBookmarkById :one
SELECT bookmarks.id, bookmarks.poi_id, bookmarks.user_id, bookmarks.created_at, pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at FROM bookmarks
JOIN pois ON hservices.id = bookmarks.poi_id
WHERE bookmarks.id = $1
`

type GetBookmarkByIdRow struct {
	Bookmark Bookmark
	Poi      Poi
}

func (q *Queries) GetBookmarkById(ctx context.Context, id int32) (GetBookmarkByIdRow, error) {
	row := q.db.QueryRow(ctx, getBookmarkById, id)
	var i GetBookmarkByIdRow
	err := row.Scan(
		&i.Bookmark.ID,
		&i.Bookmark.PoiID,
		&i.Bookmark.UserID,
		&i.Bookmark.CreatedAt,
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

const getBookmarksByUserId = `-- name: GetBookmarksByUserId :many
SELECT 
  bookmarks.id, bookmarks.poi_id, bookmarks.user_id, bookmarks.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at,
  categories.id, categories.name, categories.image,
  addresses.id, addresses.city_id, addresses.line1, addresses.line2, addresses.postal_code, addresses.lat, addresses.lng,
  cities.id, cities.name, cities.state_code, cities.state_name, cities.country_code, cities.country_name, cities.image_url, cities.latitude, cities.longitude, cities.description,
  media.id, media.poi_id, media.url, media.thumbnail, media.alt, media.caption, media.width, media.height, media.media_order, media.extension, media.mime_type, media.file_size, media.created_at
FROM bookmarks
  JOIN pois ON pois.id = bookmarks.poi_id
  JOIN categories ON categories.id = pois.category_id
  JOIN addresses ON addresses.id = pois.address_id
  JOIN cities ON addresses.city_id = cities.id
  JOIN media ON media.poi_id = pois.id
WHERE bookmarks.user_id = $1 AND media.media_order = 1
ORDER BY bookmarks.created_at DESC
OFFSET $2
LIMIT $3
`

type GetBookmarksByUserIdParams struct {
	UserID string
	Offset int32
	Limit  int32
}

type GetBookmarksByUserIdRow struct {
	Bookmark Bookmark
	Poi      Poi
	Category Category
	Address  Address
	City     City
	Medium   Medium
}

func (q *Queries) GetBookmarksByUserId(ctx context.Context, arg GetBookmarksByUserIdParams) ([]GetBookmarksByUserIdRow, error) {
	rows, err := q.db.Query(ctx, getBookmarksByUserId, arg.UserID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetBookmarksByUserIdRow
	for rows.Next() {
		var i GetBookmarksByUserIdRow
		if err := rows.Scan(
			&i.Bookmark.ID,
			&i.Bookmark.PoiID,
			&i.Bookmark.UserID,
			&i.Bookmark.CreatedAt,
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
			&i.Medium.ID,
			&i.Medium.PoiID,
			&i.Medium.Url,
			&i.Medium.Thumbnail,
			&i.Medium.Alt,
			&i.Medium.Caption,
			&i.Medium.Width,
			&i.Medium.Height,
			&i.Medium.MediaOrder,
			&i.Medium.Extension,
			&i.Medium.MimeType,
			&i.Medium.FileSize,
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

const isBookmarked = `-- name: IsBookmarked :one
SELECT id FROM bookmarks
WHERE poi_id = $1 AND user_id = $2
`

type IsBookmarkedParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) IsBookmarked(ctx context.Context, arg IsBookmarkedParams) (int32, error) {
	row := q.db.QueryRow(ctx, isBookmarked, arg.PoiID, arg.UserID)
	var id int32
	err := row.Scan(&id)
	return id, err
}