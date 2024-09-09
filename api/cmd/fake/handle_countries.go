package main

import (
	"context"
	"encoding/csv"
	"os"
	"strconv"
	"wanderlust/internal/db"
)

func handleCountries() error {
	const (
		filepath       = "data/countries.csv"
		expectedFormat = "[id name iso3 iso2 numeric_code phone_code capital currency currency_name currency_symbol tld native region subregion timezones latitude longitude emoji emojiU]"
	)

	logger.Trace("handling countries. reading file", logger.Args("filepath", filepath))

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

		id, err := strconv.Atoi(record[0])

		if err != nil {
			logger.Error("Error processing record at id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lat, err := strconv.ParseFloat(record[15], 64)

		if err != nil {
			logger.Error("Error processing record at latitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lng, err := strconv.ParseFloat(record[16], 64)

		if err != nil {
			logger.Error("Error processing record at longitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		_, err = d.Queries.CreateCountry(context.Background(), db.CreateCountryParams{
			ID:             int32(id),
			Name:           record[1],
			Iso2:           record[3],
			NumericCode:    record[4],
			PhoneCode:      record[5],
			Capital:        record[6],
			Currency:       record[7],
			CurrencyName:   record[8],
			CurrencySymbol: record[9],
			Tld:            record[10],
			Native:         record[11],
			Region:         record[12],
			Subregion:      record[13],
			Timezones:      record[14],
			Latitude:       lat,
			Longitude:      lng,
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
