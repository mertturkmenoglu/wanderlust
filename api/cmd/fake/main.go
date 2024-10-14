package main

import (
	"fmt"
	"slices"
	"strconv"
	"wanderlust/internal/pkg/config"
	"wanderlust/internal/pkg/db"

	"github.com/pterm/pterm"
)

var logger = pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)

var database *db.Db

var genOptions = []string{
	"addresses",
	"amenities",
	"amenities-pois",
	"bookmarks",
	"categories",
	"cities",
	"favorites",
	"follows",
	"lists",
	"list-items",
	"media",
	"point-of-interests",
	"reviews",
	"users",
}

var countOptions = []string{
	"1000",
	"10000",
	"100000",
	"500000",
}

var noCountNeeded = []string{
	"amenities",
	"categories",
	"cities",
	"media", // because we handle it on the handler level
}

func GetDb() *db.Db {
	if database == nil {
		database = db.NewDb()
	}
	return database
}

func main() {
	_ = config.GetConfiguration()

	pterm.DefaultBasicText.
		Println("You can use the" + pterm.LightYellow(" arrow keys ") + "to navigate between options.")

	genType, _ := pterm.
		DefaultInteractiveSelect.
		WithMaxHeight(20).
		WithOptions(genOptions).
		Show()

	n := 0

	if !slices.Contains(noCountNeeded, genType) {
		sCount, _ := pterm.
			DefaultInteractiveSelect.
			WithOptions(countOptions).
			Show("How many do you want to generate?")

		count, err := strconv.Atoi(sCount)

		if err != nil {
			logger.Error("Invalid count. Terminating.", logger.Args("count", count))
			return
		}

		n = count
	}

	logger.Info("Generating data", logger.Args("count", n, "type", genType))

	err := generateAndInsert(genType, int(n))

	if err != nil {
		logger.Fatal("Encountered error. Terminating", logger.Args("error", err.Error()))
		return
	}

	logger.Info("Completed successfully")
}

func generateAndInsert(genType string, count int) error {
	switch genType {
	case "addresses":
		return handleAddresses(count)
	case "amenities":
		return handleAmenities()
	case "amenities-pois":
		return handleAmenitiesPois(count)
	case "bookmarks":
		return fmt.Errorf("not implemented")
	case "categories":
		return handleCategories()
	case "cities":
		return handleCities()
	case "favorites":
		return fmt.Errorf("not implemented")
	case "follows":
		return fmt.Errorf("not implemented")
	case "lists":
		return fmt.Errorf("not implemented")
	case "list-items":
		return fmt.Errorf("not implemented")
	case "media":
		return handleMedia()
	case "point-of-interests":
		return handlePois(count)
	case "reviews":
		return fmt.Errorf("not implemented")
	case "users":
		return handleUsers(count)
	default:
		return fmt.Errorf("invalid type")
	}
}
