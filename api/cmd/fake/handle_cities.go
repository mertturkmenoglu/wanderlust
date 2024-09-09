package main

import (
	"context"
	"encoding/csv"
	"os"
	"slices"
	"strconv"
	"wanderlust/internal/db"
)

func handleCities() error {
	const (
		filepath = "data/cities.csv"
		step     = 1_000
	)

	logger.Trace("handling cities. reading file", logger.Args("filepath", filepath))

	file, err := os.Open(filepath)

	if err != nil {
		return err
	}

	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()

	if err != nil {
		return err
	}

	r := records[1:]
	chunkIndex := 0
	logger.Trace("batch generating and inserting", logger.Args("total items", len(r)))

	for chunk := range slices.Chunk(r, step) {
		if chunkIndex%10 == 0 {
			logger.Trace("Processing chunk", logger.Args("index", chunkIndex))
		}

		err := batchInsertCities(chunk)
		if err != nil {
			return err
		}
		chunkIndex++
	}

	logger.Trace("insertion completed")

	return nil
}

func batchInsertCities(chunk [][]string) error {
	d := GetDb()
	tctx := context.Background()

	tx, err := d.Pool.Begin(tctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(tctx)
	qtx := d.Queries.WithTx(tx)

	for i, record := range chunk {
		id, err := strconv.Atoi(record[0])

		if err != nil {
			logger.Error("Error processing record at id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		stateId, err := strconv.Atoi(record[2])

		if err != nil {
			logger.Error("Error processing record at state id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		countryId, err := strconv.Atoi(record[5])

		if err != nil {
			logger.Error("Error processing record at country id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lat, err := strconv.ParseFloat(record[8], 64)

		if err != nil {
			logger.Error("Error processing record at latitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lng, err := strconv.ParseFloat(record[9], 64)

		if err != nil {
			logger.Error("Error processing record at longitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		_, err = qtx.CreateCity(context.Background(), db.CreateCityParams{
			ID:          int32(id),
			Name:        record[1],
			StateID:     int32(stateId),
			StateCode:   record[3],
			StateName:   record[4],
			CountryID:   int32(countryId),
			CountryCode: record[6],
			CountryName: record[7],
			Latitude:    lat,
			Longitude:   lng,
			WikiDataID:  record[10],
		})

		if err != nil {
			logger.Error("Error inserting record", logger.Args("index", i, "err", err.Error()))
			continue
		}
	}

	return tx.Commit(tctx)
}
