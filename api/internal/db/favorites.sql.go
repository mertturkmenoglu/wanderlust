// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: favorites.sql

package db

import (
	"context"
)

const countUserFavorites = `-- name: CountUserFavorites :one
SELECT COUNT(*) FROM favorites
WHERE user_id = $1
`

func (q *Queries) CountUserFavorites(ctx context.Context, userID string) (int64, error) {
	row := q.db.QueryRow(ctx, countUserFavorites, userID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createFavorite = `-- name: CreateFavorite :one
INSERT INTO favorites (
  user_id,
  poi_id
) VALUES (
  $1,
  $2
)
RETURNING id, poi_id, user_id, created_at
`

type CreateFavoriteParams struct {
	UserID string
	PoiID  string
}

func (q *Queries) CreateFavorite(ctx context.Context, arg CreateFavoriteParams) (Favorite, error) {
	row := q.db.QueryRow(ctx, createFavorite, arg.UserID, arg.PoiID)
	var i Favorite
	err := row.Scan(
		&i.ID,
		&i.PoiID,
		&i.UserID,
		&i.CreatedAt,
	)
	return i, err
}

const deleteFavoriteByPoiId = `-- name: DeleteFavoriteByPoiId :exec
DELETE FROM favorites
WHERE poi_id = $1 AND user_id = $2
`

type DeleteFavoriteByPoiIdParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) DeleteFavoriteByPoiId(ctx context.Context, arg DeleteFavoriteByPoiIdParams) error {
	_, err := q.db.Exec(ctx, deleteFavoriteByPoiId, arg.PoiID, arg.UserID)
	return err
}

const getFavoriteById = `-- name: GetFavoriteById :one
SELECT favorites.id, favorites.poi_id, favorites.user_id, favorites.created_at, pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at FROM favorites
JOIN pois ON pois.id = favorites.poi_id
WHERE favorites.id = $1
`

type GetFavoriteByIdRow struct {
	Favorite Favorite
	Poi      Poi
}

func (q *Queries) GetFavoriteById(ctx context.Context, id int32) (GetFavoriteByIdRow, error) {
	row := q.db.QueryRow(ctx, getFavoriteById, id)
	var i GetFavoriteByIdRow
	err := row.Scan(
		&i.Favorite.ID,
		&i.Favorite.PoiID,
		&i.Favorite.UserID,
		&i.Favorite.CreatedAt,
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

const getFavoritesByUserId = `-- name: GetFavoritesByUserId :many
SELECT 
  favorites.id, favorites.poi_id, favorites.user_id, favorites.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at,
  categories.id, categories.name, categories.image,
  addresses.id, addresses.city_id, addresses.line1, addresses.line2, addresses.postal_code, addresses.lat, addresses.lng,
  cities.id, cities.name, cities.state_code, cities.state_name, cities.country_code, cities.country_name, cities.image_url, cities.latitude, cities.longitude, cities.description,
  media.id, media.poi_id, media.url, media.thumbnail, media.alt, media.caption, media.width, media.height, media.media_order, media.extension, media.mime_type, media.file_size, media.created_at
FROM favorites
  JOIN pois ON pois.id = favorites.poi_id
  JOIN categories ON categories.id = pois.category_id
  JOIN addresses ON addresses.id = pois.address_id
  JOIN cities ON addresses.city_id = cities.id
  JOIN media ON media.poi_id = pois.id
WHERE favorites.user_id = $1 AND media.media_order = 1
ORDER BY favorites.created_at DESC
OFFSET $2
LIMIT $3
`

type GetFavoritesByUserIdParams struct {
	UserID string
	Offset int32
	Limit  int32
}

type GetFavoritesByUserIdRow struct {
	Favorite Favorite
	Poi      Poi
	Category Category
	Address  Address
	City     City
	Medium   Medium
}

func (q *Queries) GetFavoritesByUserId(ctx context.Context, arg GetFavoritesByUserIdParams) ([]GetFavoritesByUserIdRow, error) {
	rows, err := q.db.Query(ctx, getFavoritesByUserId, arg.UserID, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetFavoritesByUserIdRow
	for rows.Next() {
		var i GetFavoritesByUserIdRow
		if err := rows.Scan(
			&i.Favorite.ID,
			&i.Favorite.PoiID,
			&i.Favorite.UserID,
			&i.Favorite.CreatedAt,
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

const isFavorite = `-- name: IsFavorite :one
SELECT id FROM favorites
WHERE poi_id = $1 AND user_id = $2
`

type IsFavoriteParams struct {
	PoiID  string
	UserID string
}

func (q *Queries) IsFavorite(ctx context.Context, arg IsFavoriteParams) (int32, error) {
	row := q.db.QueryRow(ctx, isFavorite, arg.PoiID, arg.UserID)
	var id int32
	err := row.Scan(&id)
	return id, err
}