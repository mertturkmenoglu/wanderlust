package handlers

import (
	"wanderlust/pkg/db"

	"github.com/pterm/pterm"
)

type Fake struct {
	Logger *pterm.Logger
	db     *db.Db
}

func NewFake() *Fake {
	return &Fake{
		Logger: pterm.DefaultLogger.WithLevel(pterm.LogLevelTrace),
		db:     db.NewDb(),
	}
}

type IFaker interface {
	Generate() (int64, error)
}
