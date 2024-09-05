package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func Bootstrap() {
	// First load the .env file
	err := godotenv.Load()

	if err != nil {
		log.Fatal("error loading .env file")
	}

	viper.SetConfigName("dev")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("config/")
	viper.AddConfigPath(".")

	err = viper.ReadInConfig()

	if err != nil {
		log.Fatal("Cannot read configuration file: " + err.Error())
	}

	// Fill empty values in yaml file using .env file values
	viper.Set(GOOGLE_CLIENT_ID, os.Getenv("GOOGLE_CLIENT_ID"))
	viper.Set(GOOGLE_CLIENT_SECRET, os.Getenv("GOOGLE_CLIENT_SECRET"))
	viper.Set(FB_CLIENT_ID, os.Getenv("FACEBOOK_CLIENT_ID"))
	viper.Set(FB_CLIENT_SECRET, os.Getenv("FACEBOOK_CLIENT_SECRET"))
}
