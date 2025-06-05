package handlers

import (
	"context"
	_ "embed"
)

//go:embed cities.sql
var sqlQuery string

type FakeCities struct {
	*Fake
}

func (f *FakeCities) Generate() (int64, error) {
	ct, err := f.db.Pool.Exec(context.Background(), sqlQuery)

	if err != nil {
		return 0, err
	}

	return ct.RowsAffected(), nil
}
