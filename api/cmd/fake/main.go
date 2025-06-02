package main

import (
	"flag"
	"log"
	"wanderlust/pkg/cfg"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

	cfg.Init()

	modePtr := flag.String("mode", "interactive", "Mode to run the script. Can be interactive or automate")
	flag.Parse()

	mode := *modePtr

	if mode != "interactive" && mode != "automate" {
		log.Fatal("Invalid mode. Terminating.")
	}

	if mode == "automate" {
		err := automate()

		if err != nil {
			log.Fatal("Encountered error. Terminating", err)
		}
	} else if mode == "interactive" {
		log.Fatal("Not implemented")
	}
}
