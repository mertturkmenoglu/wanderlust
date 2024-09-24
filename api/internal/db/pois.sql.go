// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: pois.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

type BatchCreatePoisParams struct {
	ID                 string
	Name               string
	Phone              pgtype.Text
	Description        string
	AddressID          int32
	Website            pgtype.Text
	PriceLevel         int16
	AccessibilityLevel int16
	TotalVotes         int32
	TotalPoints        int32
	TotalFavorites     int32
	CategoryID         int16
	OpenTimes          []byte
}

const getPoiAmenities = `-- name: GetPoiAmenities :many
SELECT amenities_pois.amenity_id, amenities_pois.poi_id, amenities.id, amenities.name FROM amenities_pois
LEFT JOIN amenities ON amenities.id = amenities_pois.amenity_id
WHERE poi_id = $1
ORDER BY amenity_id
`

type GetPoiAmenitiesRow struct {
	AmenitiesPoi AmenitiesPoi
	Amenity      Amenity
}

func (q *Queries) GetPoiAmenities(ctx context.Context, poiID string) ([]GetPoiAmenitiesRow, error) {
	rows, err := q.db.Query(ctx, getPoiAmenities, poiID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetPoiAmenitiesRow
	for rows.Next() {
		var i GetPoiAmenitiesRow
		if err := rows.Scan(
			&i.AmenitiesPoi.AmenityID,
			&i.AmenitiesPoi.PoiID,
			&i.Amenity.ID,
			&i.Amenity.Name,
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

const getPoiById = `-- name: GetPoiById :one
SELECT pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at, addresses.id, addresses.city_id, addresses.line1, addresses.line2, addresses.postal_code, addresses.lat, addresses.lng, categories.id, categories.name, categories.image, cities.id, cities.name, cities.state_code, cities.state_name, cities.country_code, cities.country_name, cities.image_url, cities.latitude, cities.longitude, cities.description FROM pois
LEFT JOIN addresses ON addresses.id = pois.address_id
LEFT JOIN categories ON categories.id = pois.category_id
LEFT JOIN cities ON cities.id = addresses.city_id
WHERE pois.id = $1 LIMIT 1
`

type GetPoiByIdRow struct {
	Poi      Poi
	Address  Address
	Category Category
	City     City
}

func (q *Queries) GetPoiById(ctx context.Context, id string) (GetPoiByIdRow, error) {
	row := q.db.QueryRow(ctx, getPoiById, id)
	var i GetPoiByIdRow
	err := row.Scan(
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
		&i.Address.ID,
		&i.Address.CityID,
		&i.Address.Line1,
		&i.Address.Line2,
		&i.Address.PostalCode,
		&i.Address.Lat,
		&i.Address.Lng,
		&i.Category.ID,
		&i.Category.Name,
		&i.Category.Image,
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
	)
	return i, err
}

const getPoiMedia = `-- name: GetPoiMedia :many
SELECT id, poi_id, url, thumbnail, alt, caption, width, height, media_order, extension, mime_type, file_size, created_at FROM media
WHERE poi_id = $1
ORDER BY media_order
`

func (q *Queries) GetPoiMedia(ctx context.Context, poiID string) ([]Medium, error) {
	rows, err := q.db.Query(ctx, getPoiMedia, poiID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Medium
	for rows.Next() {
		var i Medium
		if err := rows.Scan(
			&i.ID,
			&i.PoiID,
			&i.Url,
			&i.Thumbnail,
			&i.Alt,
			&i.Caption,
			&i.Width,
			&i.Height,
			&i.MediaOrder,
			&i.Extension,
			&i.MimeType,
			&i.FileSize,
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

const peekPois = `-- name: PeekPois :many
SELECT id, name, phone, description, address_id, website, price_level, accessibility_level, total_votes, total_points, total_favorites, category_id, open_times, created_at, updated_at FROM pois
LIMIT 25
`

func (q *Queries) PeekPois(ctx context.Context) ([]Poi, error) {
	rows, err := q.db.Query(ctx, peekPois)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Poi
	for rows.Next() {
		var i Poi
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Phone,
			&i.Description,
			&i.AddressID,
			&i.Website,
			&i.PriceLevel,
			&i.AccessibilityLevel,
			&i.TotalVotes,
			&i.TotalPoints,
			&i.TotalFavorites,
			&i.CategoryID,
			&i.OpenTimes,
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

const randSelectPois = `-- name: RandSelectPois :many
SELECT id
FROM pois
ORDER BY RANDOM()
LIMIT $1
`

func (q *Queries) RandSelectPois(ctx context.Context, limit int32) ([]string, error) {
	rows, err := q.db.Query(ctx, randSelectPois, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		items = append(items, id)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
