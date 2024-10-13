package main

import "wanderlust/internal/db"

var database *db.Db

func GetDb() *db.Db {
	if database == nil {
		database = db.NewDb()
	}
	return database
}
