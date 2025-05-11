package core

import (
	"wanderlust/internal/pkg/activities"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/email"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"

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
