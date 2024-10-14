package main

import (
	"fmt"
	"wanderlust/internal/pkg/config"

	"github.com/pterm/pterm"
)

var logger = pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace)

var generationOptions = []string{
	"point-of-interests",
}

func main() {
	_ = config.GetConfiguration()

	pterm.DefaultBasicText.
		Println("You can use the" + pterm.LightYellow(" arrow keys ") + "to navigate between options.")

	genType, _ := pterm.
		DefaultInteractiveSelect.
		WithMaxHeight(20).
		WithOptions(generationOptions).
		Show()

	logger.Info("Syncing database with Typesense", logger.Args("type", genType))

	err := doSync(genType)

	if err != nil {
		logger.Fatal("Encountered error. Terminating.", logger.Args("error", err.Error()))
		return
	}

	logger.Info("Completed successfully")
}

func doSync(genType string) error {
	switch genType {
	case "point-of-interests":
		return handlePoiSync()
	default:
		return fmt.Errorf("unknown generation type")
	}
}
