// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: categories.sql

package db

import (
	"context"
)

const createCategory = `-- name: CreateCategory :one
INSERT INTO categories (
  id,
  name,
  image
) VALUES (
  $1,
  $2,
  $3
) RETURNING id, name, image
`

type CreateCategoryParams struct {
	ID    int16
	Name  string
	Image string
}

func (q *Queries) CreateCategory(ctx context.Context, arg CreateCategoryParams) (Category, error) {
	row := q.db.QueryRow(ctx, createCategory, arg.ID, arg.Name, arg.Image)
	var i Category
	err := row.Scan(&i.ID, &i.Name, &i.Image)
	return i, err
}
