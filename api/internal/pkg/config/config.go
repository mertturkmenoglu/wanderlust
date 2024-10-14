package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

var cfg *Configuration

func GetConfiguration() *Configuration {
	if cfg == nil {
		cfg = MustBootstrap()
	}

	return cfg
}

type Configuration struct {
	viper.Viper
}

func MustBootstrap() *Configuration {
	c := &Configuration{
		*viper.New(),
	}

	c.SetConfigName("dev")
	c.SetConfigType("yaml")
	c.AddConfigPath("conf/")
	c.AddConfigPath(".")

	err := c.ReadInConfig()

	if err != nil {
		panic("cannot read configuration file: " + err.Error())
	}

	err = c.readFromEnv()

	if err != nil {
		panic("cannot read variables from .env file: " + err.Error())
	}

	return c
}

func (c *Configuration) readFromEnv() error {
	err := godotenv.Load()

	if err != nil {
		return err
	}

	c.Set(GOOGLE_CLIENT_ID, os.Getenv("GOOGLE_CLIENT_ID"))
	c.Set(GOOGLE_CLIENT_SECRET, os.Getenv("GOOGLE_CLIENT_SECRET"))
	c.Set(FB_CLIENT_ID, os.Getenv("FB_CLIENT_ID"))
	c.Set(FB_CLIENT_SECRET, os.Getenv("FB_CLIENT_SECRET"))

	return nil
}
