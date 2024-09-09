package main

import (
	"context"
	"encoding/csv"
	"os"
	"strconv"
	"wanderlust/internal/db"

	"github.com/jackc/pgx/v5/pgtype"
)

func handleStates() error {
	const (
		filepath       = "data/states.csv"
		expectedFormat = "[id name country_id country_code country_name state_code type latitude longitude]"
	)

	logger.Trace("handling states. reading file", logger.Args("filepath", filepath))

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

	totalItems := len(records) - 1
	successfullInserts := 0
	d := GetDb()

	for i, record := range records {
		if i == 0 {
			// Header row, skip
			continue
		}

		if i%100 == 0 {
			logger.Trace("Processing record", logger.Args("index", i))
		}

		id, err := strconv.Atoi(record[0])

		if err != nil {
			logger.Error("Error processing record at id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		countryId, err := strconv.Atoi(record[2])

		if err != nil {
			logger.Error("Error processing record at country id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lat, err := strconv.ParseFloat(record[7], 64)

		if err != nil {
			logger.Error("Error processing record at latitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lng, err := strconv.ParseFloat(record[8], 64)

		if err != nil {
			logger.Error("Error processing record at longitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		_, err = d.Queries.CreateState(context.Background(), db.CreateStateParams{
			ID:          int32(id),
			Name:        record[1],
			CountryID:   int32(countryId),
			CountryCode: record[3],
			CountryName: record[4],
			StateCode:   record[5],
			Type:        pgtype.Text{String: record[6]},
			Latitude:    lat,
			Longitude:   lng,
		})

		if err != nil {
			logger.Error("Error inserting record", logger.Args("index", i, "err", err.Error()))
			continue
		}

		successfullInserts++
	}

	logger.Trace("insertion completed", logger.Args("successfull inserts", successfullInserts, "total items", totalItems))

	return nil
}
