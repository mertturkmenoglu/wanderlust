package authz

import (
	"wanderlust/internal/db"
)

type Authz struct {
	Db *db.Db
}

func New(db *db.Db) *Authz {
	return &Authz{
		Db: db,
	}
}
