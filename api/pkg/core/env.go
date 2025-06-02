package core

import (
	"wanderlust/pkg/cfg"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()

	if err != nil {
		panic("cannot load .env file: " + err.Error())
	}

	cfg.InitConfigurationStruct()
}
