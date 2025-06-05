package handlers

import (
	"context"
	_ "embed"
)

//go:embed cities.sql
var sqlQuery string

func (f *Fake) HandleCities() error {
	_, err := f.db.Pool.Exec(context.Background(), sqlQuery)

	if err != nil {
		return err
	}

	return nil
}
