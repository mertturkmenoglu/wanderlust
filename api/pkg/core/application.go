package core

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/durable"
	"wanderlust/pkg/logs"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/tracing"
)

type Application struct {
	*di.Container
}

func NewApplication() *Application {
	ioc := di.New()

	ioc.Set(di.SVC_DB, db.NewDb())
	ioc.Set(di.SVC_CACHE, cache.New())
	ioc.Set(di.SVC_MAIL, mail.New())
	ioc.Set(di.SVC_DURABLE, durable.New())
	ioc.Set(di.SVC_LOG, logs.NewZapLogger(tracing.NewOtlpWriter()))
	ioc.Set(di.SVC_PLOG, logs.NewPTermLogger())
	ioc.Set(di.SVC_ACTIVITIES, activities.New(ioc.Get(di.SVC_CACHE).(*cache.Cache)))
	ioc.Set(di.SVC_PLOG, logs.NewPTermLogger())

	return &Application{
		ioc,
	}
}
