package core

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"

	"github.com/pterm/pterm"
	"go.uber.org/zap"
)

type Application struct {
	Activities *activities.ActivityService
	Db         *db.Db
	Cache      *cache.Cache
	Mail       *mail.MailService
	Log        *zap.Logger
	PLog       *pterm.Logger
	Tasks      *tasks.TasksService
}

func NewApplication() *Application {
	mailSvc := mail.New()
	cacheSvc := cache.New()
	logger := logs.NewZapLogger(tracing.NewOtlpWriter())
	database := db.NewDb()

	return &Application{
		Activities: activities.New(cacheSvc),
		Db:         database,
		Cache:      cacheSvc,
		Mail:       mailSvc,
		Log:        logger,
		PLog:       logs.NewPTermLogger(),
		Tasks:      tasks.New(mailSvc, database, cacheSvc),
	}
}
