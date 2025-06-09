package core

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/id"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/pterm/pterm"
	"github.com/sony/sonyflake"
	"go.uber.org/zap"
)

type Application struct {
	Activities *activities.ActivityService
	Db         *db.Db
	Flake      *sonyflake.Sonyflake
	Cache      *cache.Cache
	ID         *id.Generator
	Mail       *mail.MailService
	Log        *zap.Logger
	PLog       *pterm.Logger
	Tasks      *tasks.TasksService
	Upload     *upload.UploadService
}

func NewApp() *Application {
	mailSvc := mail.New()
	uploadSvc := upload.New()
	cacheSvc := cache.New()
	logger := logs.NewZapLogger(tracing.NewOtlpWriter())
	flake := sonyflake.NewSonyflake(sonyflake.Settings{})
	database := db.NewDb()

	return &Application{
		Activities: activities.New(cacheSvc),
		Db:         database,
		Flake:      flake,
		Cache:      cacheSvc,
		ID:         id.NewGenerator(flake),
		Mail:       mailSvc,
		Log:        logger,
		PLog:       logs.NewPTermLogger(),
		Tasks:      tasks.New(mailSvc, uploadSvc, database, cacheSvc),
		Upload:     uploadSvc,
	}
}
