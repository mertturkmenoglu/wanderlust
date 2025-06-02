package core

import (
	"wanderlust/pkg/cfg"

	"github.com/joho/godotenv"
)

func LoadEnv(path string) {
	if path == "" {
		path = ".env"
	}

	err := godotenv.Load(path)

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

	cfg.Init()
}
