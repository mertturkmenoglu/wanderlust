package core

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/id"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/tasks"
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
