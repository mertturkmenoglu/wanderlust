package bootstrap

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/id"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/sony/sonyflake"
)

func NewApp() *core.Application {
	mailSvc := mail.New()
	uploadSvc := upload.New()
	cacheSvc := cache.New()
	logger := logs.NewZapLogger(tracing.NewOtlpWriter())
	flake := sonyflake.NewSonyflake(sonyflake.Settings{})

	return &core.Application{
		Activities: activities.New(cacheSvc),
		Db:         db.NewDb(),
		Flake:      flake,
		ID:         id.NewGenerator(flake),
		Log:        logger,
		Cache:      cacheSvc,
		Mail:       mailSvc,
		Tasks:      tasks.New(mailSvc, uploadSvc),
		Upload:     uploadSvc,
		PLog:       logs.NewPTermLogger(),
	}
}
