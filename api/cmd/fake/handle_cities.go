package main

import (
	"context"
	_ "embed"
)

//go:embed cities.sql
var sqlQuery string

func handleCities() error {
	logger.Info("Starting cities generation")

	d := GetDb()
	_, err := d.Pool.Exec(context.Background(), sqlQuery)

	if err != nil {
		return err
	}

	logger.Info("Ending cities generation")
	return nil
}
