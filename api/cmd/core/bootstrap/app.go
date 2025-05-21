package bootstrap

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/email"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/sony/sonyflake"
)

func NewApp() *core.Application {
	emailSvc := email.New()
	uploadSvc := upload.New()
	cacheSvc := cache.New()
	logger := logs.NewZapLogger(tracing.NewOtlpWriter())

	return &core.Application{
		Activities: activities.NewActivity(cacheSvc),
		Db:         db.NewDb(),
		Flake:      sonyflake.NewSonyflake(sonyflake.Settings{}),
		Log:        logger,
		Cache:      cacheSvc,
		Email:      emailSvc,
		Tasks:      tasks.New(emailSvc, uploadSvc),
		Upload:     uploadSvc,
		PLog:       logs.NewPTermLogger(),
	}
}
