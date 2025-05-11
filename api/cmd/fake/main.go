package main

import (
	"fmt"
	"slices"
	"strconv"
	"wanderlust/internal/pkg/db"

	"github.com/joho/godotenv"
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
	"media-many",
	"point-of-interests",
	"reviews",
	"review-media",
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
	"amenities-pois",
	"categories",
	"cities",
	"media",      // because we handle it on the handler level
	"media-many", // because we handle it on the handler level
	"reviews",
	"review-media",
}

func GetDb() *db.Db {
	if database == nil {
		database = db.NewDb()
	}
	return database
}

func main() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

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

	err = generateAndInsert(genType, int(n))

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
		return handleAmenitiesPois()
	case "bookmarks":
		return fmt.Errorf("not implemented")
	case "categories":
		return handleCategories()
	case "cities":
		return fmt.Errorf("not implemented")
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
	case "media-many":
		return handleMediaForManyPois()
	case "point-of-interests":
		return handlePois(count)
	case "reviews":
		return handleReviews()
	case "review-media":
		return handleReviewMedia()
	case "users":
		return handleUsers(count)
	default:
		return fmt.Errorf("invalid type")
	}
}
