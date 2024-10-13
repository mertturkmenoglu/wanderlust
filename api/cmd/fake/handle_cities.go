package main

import (
	"context"
	"encoding/csv"
	"os"
	"slices"
	"strconv"
	"wanderlust/internal/pkg/db"
)

func handleCities() error {
	const (
		filepath = "data/cities.csv"
		step     = 100
	)

	logger.Trace("handling cities. reading file", logger.Args("filepath", filepath))

	file, err := os.Open(filepath)

	if err != nil {
		return err
	}

	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = '|'
	records, err := reader.ReadAll()

	if err != nil {
		return err
	}

	r := records[1:]
	chunkIndex := 0
	logger.Trace("batch generating and inserting", logger.Args("total items", len(r)))

	for chunk := range slices.Chunk(r, step) {
		if chunkIndex%100 == 0 {
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
	p := make([]db.CreateCitiesParams, 0, len(chunk))

	for i, record := range chunk {
		idStr := record[0]
		name := record[1]
		stateCode := record[2]
		stateName := record[3]
		countryCode := record[4]
		countryName := record[5]
		imageUrl := record[6]
		latitudeStr := record[7]
		longitudeStr := record[8]
		description := record[9]

		id, err := strconv.Atoi(idStr)

		if err != nil {
			logger.Error("Error processing record at id field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lat, err := strconv.ParseFloat(latitudeStr, 64)

		if err != nil {
			logger.Error("Error processing record at latitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		lng, err := strconv.ParseFloat(longitudeStr, 64)

		if err != nil {
			logger.Error("Error processing record at longitude field. Continuing", logger.Args("index", i, "err", err.Error()))
			continue
		}

		p = append(p, db.CreateCitiesParams{
			ID:          int32(id),
			Name:        name,
			StateCode:   stateCode,
			StateName:   stateName,
			CountryCode: countryCode,
			CountryName: countryName,
			ImageUrl:    imageUrl,
			Latitude:    lat,
			Longitude:   lng,
			Description: description,
		})
	}

	_, err := d.Queries.CreateCities(context.Background(), p)

	if err != nil {
		return err
	}

	return nil
}
