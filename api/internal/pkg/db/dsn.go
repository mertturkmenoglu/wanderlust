package db

import (
	"fmt"
	"wanderlust/internal/pkg/cfg"
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
	return databaseConfigVariables{
		user:     cfg.Get(cfg.DB_USER),
		password: cfg.Get(cfg.DB_PASSWORD),
		host:     cfg.Get(cfg.DB_HOST),
		name:     cfg.Get(cfg.DB_NAME),
		port:     cfg.GetInt(cfg.DB_PORT),
		timezone: cfg.Get(cfg.DB_TIMEZONE),
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
