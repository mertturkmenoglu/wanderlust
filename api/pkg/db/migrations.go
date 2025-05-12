package db

import (
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunMigrations() {
	connString := getConnStringFromEnv()

	m, err := migrate.New(
		"file://pkg/db/migrations",
		connString,
	)

	if err != nil {
		log.Fatal("Running migrations. Connection error: ", err)
	}

	if err := m.Up(); err != nil {
		msg := err.Error()
		if msg == "no change" {
			fmt.Println("Migrations run, no change needed")
		} else {
			log.Fatal("Running migrations. Up error: ", err)
		}
	}
}
