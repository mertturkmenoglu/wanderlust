package main

import "wanderlust/internal/pkg/db"

var database *db.Db

func GetDb() *db.Db {
	if database == nil {
		database = db.NewDb()
	}
	return database
}
