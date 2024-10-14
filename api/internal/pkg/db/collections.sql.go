// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: collections.sql

package db

import (
	"context"
)

const countCollections = `-- name: CountCollections :one
SELECT count(*) FROM collections
`

func (q *Queries) CountCollections(ctx context.Context) (int64, error) {
	row := q.db.QueryRow(ctx, countCollections)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createCollection = `-- name: CreateCollection :one
INSERT INTO collections (
  id,
  name,
  description
) VALUES (
  $1,
  $2,
  $3
) RETURNING id, name, description, created_at
`

type CreateCollectionParams struct {
	ID          string
	Name        string
	Description string
}

func (q *Queries) CreateCollection(ctx context.Context, arg CreateCollectionParams) (Collection, error) {
	row := q.db.QueryRow(ctx, createCollection, arg.ID, arg.Name, arg.Description)
	var i Collection
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
	)
	return i, err
}

const createCollectionItem = `-- name: CreateCollectionItem :one
INSERT INTO collection_items (
  collection_id,
  poi_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
) RETURNING collection_id, poi_id, list_index, created_at
`

type CreateCollectionItemParams struct {
	CollectionID string
	PoiID        string
	ListIndex    int32
}

func (q *Queries) CreateCollectionItem(ctx context.Context, arg CreateCollectionItemParams) (CollectionItem, error) {
	row := q.db.QueryRow(ctx, createCollectionItem, arg.CollectionID, arg.PoiID, arg.ListIndex)
	var i CollectionItem
	err := row.Scan(
		&i.CollectionID,
		&i.PoiID,
		&i.ListIndex,
		&i.CreatedAt,
	)
	return i, err
}

const decrListIndexAfterDelete = `-- name: DecrListIndexAfterDelete :exec
UPDATE collection_items
SET 
  list_index = list_index - 1
WHERE collection_id = $1 AND list_index > $2
`

type DecrListIndexAfterDeleteParams struct {
	CollectionID string
	ListIndex    int32
}

func (q *Queries) DecrListIndexAfterDelete(ctx context.Context, arg DecrListIndexAfterDeleteParams) error {
	_, err := q.db.Exec(ctx, decrListIndexAfterDelete, arg.CollectionID, arg.ListIndex)
	return err
}

const deleteAllCollectionItems = `-- name: DeleteAllCollectionItems :exec
DELETE FROM collection_items
WHERE collection_id = $1
`

func (q *Queries) DeleteAllCollectionItems(ctx context.Context, collectionID string) error {
	_, err := q.db.Exec(ctx, deleteAllCollectionItems, collectionID)
	return err
}

const deleteCollection = `-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = $1
`

func (q *Queries) DeleteCollection(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteCollection, id)
	return err
}

const deleteCollectionItemAtIndex = `-- name: DeleteCollectionItemAtIndex :exec
DELETE FROM collection_items
WHERE collection_id = $1 AND list_index = $2
`

type DeleteCollectionItemAtIndexParams struct {
	CollectionID string
	ListIndex    int32
}

func (q *Queries) DeleteCollectionItemAtIndex(ctx context.Context, arg DeleteCollectionItemAtIndexParams) error {
	_, err := q.db.Exec(ctx, deleteCollectionItemAtIndex, arg.CollectionID, arg.ListIndex)
	return err
}

const getCollectionById = `-- name: GetCollectionById :one
SELECT id, name, description, created_at FROM collections
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetCollectionById(ctx context.Context, id string) (Collection, error) {
	row := q.db.QueryRow(ctx, getCollectionById, id)
	var i Collection
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
	)
	return i, err
}

const getCollectionItem = `-- name: GetCollectionItem :one
SELECT collection_id, poi_id, list_index, created_at FROM collection_items
WHERE collection_id = $1 AND poi_id = $2
LIMIT 1
`

type GetCollectionItemParams struct {
	CollectionID string
	PoiID        string
}

func (q *Queries) GetCollectionItem(ctx context.Context, arg GetCollectionItemParams) (CollectionItem, error) {
	row := q.db.QueryRow(ctx, getCollectionItem, arg.CollectionID, arg.PoiID)
	var i CollectionItem
	err := row.Scan(
		&i.CollectionID,
		&i.PoiID,
		&i.ListIndex,
		&i.CreatedAt,
	)
	return i, err
}

const getCollectionItems = `-- name: GetCollectionItems :many
SELECT 
  collection_items.collection_id, collection_items.poi_id, collection_items.list_index, collection_items.created_at,
  pois.id, pois.name, pois.phone, pois.description, pois.address_id, pois.website, pois.price_level, pois.accessibility_level, pois.total_votes, pois.total_points, pois.total_favorites, pois.category_id, pois.open_times, pois.created_at, pois.updated_at,
  categories.id, categories.name, categories.image,
  addresses.id, addresses.city_id, addresses.line1, addresses.line2, addresses.postal_code, addresses.lat, addresses.lng,
  cities.id, cities.name, cities.state_code, cities.state_name, cities.country_code, cities.country_name, cities.image_url, cities.latitude, cities.longitude, cities.description,
  media.id, media.poi_id, media.url, media.alt, media.caption, media.media_order, media.created_at
FROM collection_items
  INNER JOIN pois ON collection_items.poi_id = pois.id
  LEFT JOIN categories ON pois.category_id = categories.id
  LEFT JOIN addresses ON pois.address_id = addresses.id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON pois.id = media.poi_id
WHERE media.media_order = 1 AND collection_items.collection_id = $1
ORDER BY collection_items.list_index ASC
`

type GetCollectionItemsRow struct {
	CollectionItem CollectionItem
	Poi            Poi
	Category       Category
	Address        Address
	City           City
	Medium         Medium
}

func (q *Queries) GetCollectionItems(ctx context.Context, collectionID string) ([]GetCollectionItemsRow, error) {
	rows, err := q.db.Query(ctx, getCollectionItems, collectionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetCollectionItemsRow
	for rows.Next() {
		var i GetCollectionItemsRow
		if err := rows.Scan(
			&i.CollectionItem.CollectionID,
			&i.CollectionItem.PoiID,
			&i.CollectionItem.ListIndex,
			&i.CollectionItem.CreatedAt,
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

const getCollections = `-- name: GetCollections :many
SELECT id, name, description, created_at FROM collections
ORDER BY created_at DESC
OFFSET $1
LIMIT $2
`

type GetCollectionsParams struct {
	Offset int32
	Limit  int32
}

func (q *Queries) GetCollections(ctx context.Context, arg GetCollectionsParams) ([]Collection, error) {
	rows, err := q.db.Query(ctx, getCollections, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Collection
	for rows.Next() {
		var i Collection
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
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

const getLastIndexOfCollection = `-- name: GetLastIndexOfCollection :one
SELECT COALESCE(MAX(list_index), 0)
FROM collection_items
WHERE collection_id = $1
`

func (q *Queries) GetLastIndexOfCollection(ctx context.Context, collectionID string) (interface{}, error) {
	row := q.db.QueryRow(ctx, getLastIndexOfCollection, collectionID)
	var coalesce interface{}
	err := row.Scan(&coalesce)
	return coalesce, err
}

const updateCollection = `-- name: UpdateCollection :exec
UPDATE collections
SET 
  name = $1,
  description = $2
WHERE id = $3
`

type UpdateCollectionParams struct {
	Name        string
	Description string
	ID          string
}

func (q *Queries) UpdateCollection(ctx context.Context, arg UpdateCollectionParams) error {
	_, err := q.db.Exec(ctx, updateCollection, arg.Name, arg.Description, arg.ID)
	return err
}