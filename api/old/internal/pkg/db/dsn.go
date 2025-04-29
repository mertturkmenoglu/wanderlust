package db

import (
	"fmt"
	"wanderlust/internal/pkg/config"
)

type databaseConfigVariables struct {
	user     string
	password string
	host     string
	name     string
	port     int
	timezone string
}

func getVariables() databaseConfigVariables {
	cfg := config.GetConfiguration()

	return databaseConfigVariables{
		user:     cfg.GetString(config.DB_USER),
		password: cfg.GetString(config.DB_PASSWORD),
		host:     cfg.GetString(config.DB_HOST),
		name:     cfg.GetString(config.DB_NAME),
		port:     cfg.GetInt(config.DB_PORT),
		timezone: cfg.GetString(config.DB_TIMEZONE),
	}
}

func getDsnFromEnv() string {
	vars := getVariables()

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=%s",
		vars.host,
		vars.user,
		vars.password,
		vars.name,
		vars.port,
		vars.timezone,
	)

	return dsn
}

func getConnStringFromEnv() string {
	vars := getVariables()

	connString := fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		vars.user,
		vars.password,
		vars.host,
		vars.port,
		vars.name,
	)

	return connString
}
