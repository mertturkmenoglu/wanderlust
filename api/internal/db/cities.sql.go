// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: cities.sql

package db

import (
	"context"
)

const createCity = `-- name: CreateCity :one
INSERT INTO cities (
  id,
  name,
  state_id,
  state_code,
  state_name,
  country_id,
  country_code,
  country_name,
  latitude,
  longitude,
  wiki_data_id
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11
) RETURNING id, name, state_id, state_code, state_name, country_id, country_code, country_name, latitude, longitude, wiki_data_id
`

type CreateCityParams struct {
	ID          int32
	Name        string
	StateID     int32
	StateCode   string
	StateName   string
	CountryID   int32
	CountryCode string
	CountryName string
	Latitude    float64
	Longitude   float64
	WikiDataID  string
}

func (q *Queries) CreateCity(ctx context.Context, arg CreateCityParams) (City, error) {
	row := q.db.QueryRow(ctx, createCity,
		arg.ID,
		arg.Name,
		arg.StateID,
		arg.StateCode,
		arg.StateName,
		arg.CountryID,
		arg.CountryCode,
		arg.CountryName,
		arg.Latitude,
		arg.Longitude,
		arg.WikiDataID,
	)
	var i City
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.StateID,
		&i.StateCode,
		&i.StateName,
		&i.CountryID,
		&i.CountryCode,
		&i.CountryName,
		&i.Latitude,
		&i.Longitude,
		&i.WikiDataID,
	)
	return i, err
}
