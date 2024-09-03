package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Db struct {
	Queries *Queries
	Pool    *pgxpool.Pool
}

func NewDb() *Db {
	ctx := context.Background()
	dsn := getDsnFromEnv()
	dbpool, err := pgxpool.New(ctx, dsn)

	if err != nil {
		panic(err.Error())
	}

	queries := New(dbpool)
	return &Db{
		Queries: queries,
		Pool:    dbpool,
	}
}
