package db

import (
	"fmt"
	"wanderlust/pkg/cfg"
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
		user:     cfg.Env.DBUser,
		password: cfg.Env.DBPassword,
		host:     cfg.Env.DBHost,
		name:     cfg.Env.DBName,
		port:     cfg.Env.DBPort,
		timezone: cfg.Env.DBTimezone,
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
