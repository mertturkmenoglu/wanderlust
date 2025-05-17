package core

import (
	"wanderlust/pkg/activities"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/db"
	"wanderlust/pkg/email"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/upload"

	"github.com/pterm/pterm"
	"github.com/sony/sonyflake"
	"go.uber.org/zap"
)

type Application struct {
	Activities *activities.Activity
	Db         *db.Db
	Flake      *sonyflake.Sonyflake
	Cache      *cache.Cache
	Email      *email.EmailService
	Log        *zap.Logger
	PLog       *pterm.Logger
	Tasks      *tasks.Tasks
	Upload     *upload.Upload
}
