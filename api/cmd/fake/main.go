package main

import (
	"fmt"
	"strconv"
	"wanderlust/config"
	"wanderlust/internal/db"

	"github.com/pterm/pterm"
)

var logger = pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)

var database *db.Db

var genOptions = []string{
	"bookmarks",
	"categories",
	"favorites",
	"lists",
	"list-items",
	"locations",
	"reviews",
	"users",
}

func GetDb() *db.Db {
	if database == nil {
		database = db.NewDb()
	}
	return database
}

func main() {
	config.Bootstrap()

	pterm.DefaultBasicText.Println("You can use the" + pterm.LightYellow(" arrow keys ") + "to navigate between options.")

	genType, _ := pterm.
		DefaultInteractiveSelect.
		WithOptions(genOptions).
		Show()

	sCount, _ := pterm.
		DefaultInteractiveTextInput.
		Show("How many do you want to generate? (Between 1 and 10 000)")

	count, err := strconv.Atoi(sCount)

	if err != nil || count < 1 || count > 10_000 {
		logger.Error("Invalid count. Terminating.", logger.Args("count", count))
		return
	}

	logger.Info("Generating data", logger.Args("count", count, "type", genType))

	err = generateAndInsert(genType, int(count))

	if err != nil {
		logger.Fatal("Encountered error. Terminating", logger.Args("error", err.Error()))
		return
	}

	logger.Info("Completed successfully")
}

func generateAndInsert(genType string, count int) error {
	logger.Debug("count", logger.Args("count", count))
	switch genType {
	case "bookmarks":
		return fmt.Errorf("not implemented")
	case "categories":
		return handleCategories()
	case "favorites":
		return fmt.Errorf("not implemented")
	case "lists":
		return fmt.Errorf("not implemented")
	case "list-items":
		return fmt.Errorf("not implemented")
	case "locations":
		return fmt.Errorf("not implemented")
	case "reviews":
		return fmt.Errorf("not implemented")
	case "users":
		return fmt.Errorf("not implemented")
	default:
		return fmt.Errorf("invalid type")
	}
}