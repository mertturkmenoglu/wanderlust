package main

import (
	"context"
	_ "embed"
)

//go:embed cities.sql
var sqlQuery string

func handleCities() error {
	logger.Trace("Starting to insert cities into the database")

	d := GetDb()
	_, err := d.Pool.Exec(context.Background(), sqlQuery)

	if err != nil {
		return err
	}

	logger.Info("Inserted cities into the database")
	return nil
}
