package middlewares

import "wanderlust/internal/pkg/db"

var dbClient *db.Db = nil

func getDb() *db.Db {
	if dbClient == nil {
		dbClient = db.NewDb()
	}
	return dbClient
}
