// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: collections.sql

package db

import (
	"context"
)

const createCollection = `-- name: CreateCollection :one
INSERT INTO collections (
  name,
  description
) VALUES (
  $1,
  $2
) RETURNING id, name, description, created_at
`

type CreateCollectionParams struct {
	Name        string
	Description string
}

func (q *Queries) CreateCollection(ctx context.Context, arg CreateCollectionParams) (Collection, error) {
	row := q.db.QueryRow(ctx, createCollection, arg.Name, arg.Description)
	var i Collection
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
	)
	return i, err
}

const deleteCollection = `-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = $1
`

func (q *Queries) DeleteCollection(ctx context.Context, id string) error {
	_, err := q.db.Exec(ctx, deleteCollection, id)
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
