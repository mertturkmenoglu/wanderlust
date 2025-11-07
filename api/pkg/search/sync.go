package search

import (
	"log"
	"time"

	"github.com/pterm/pterm"
)

func Sync() error {
	spinner, _ := pterm.DefaultSpinner.Start("Syncing search index")
	start := time.Now()

	err := handlePlacesSync()

	elapsed := time.Since(start)

	if err != nil {
		spinner.Fail("Failed to sync search index")
		return err
	} else {
		spinner.Success()
	}

	log.Println("Synced search index in", elapsed.String())

	return nil
}
