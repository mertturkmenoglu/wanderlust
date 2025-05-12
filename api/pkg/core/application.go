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
)

type Application struct {
	Activities *activities.Activity
	Db         *db.Db
	Flake      *sonyflake.Sonyflake
	Logger     *pterm.Logger
	Cache      *cache.Cache
	Email      *email.EmailService
	Tasks      *tasks.Tasks
	Upload     *upload.Upload
}
