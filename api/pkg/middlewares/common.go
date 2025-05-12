package middlewares

import "wanderlust/pkg/db"

var dbClient *db.Db = nil

func getDb() *db.Db {
	if dbClient == nil {
		dbClient = db.NewDb()
	}
	return dbClient
}
