package core

import (
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/tasks"

	"github.com/hibiken/asynq"
)

func GetCronSpecForTask(taskType string) string {
	isDev := cfg.Env.Env == "dev"

	switch taskType {
	case tasks.TypeFindExpiredTripInvites:
		{
			if isDev {
				return "@every 1m"
			} else {
				return "@every 5m"
			}
		}
	default:
		panic("unknown task type")
	}
}

func (w *Wanderlust) RegisterPeriodicTasks() {
	_, err := w.app.Tasks.Schedule(
		GetCronSpecForTask(tasks.TypeFindExpiredTripInvites),
		asynq.NewTask(tasks.TypeFindExpiredTripInvites, []byte{}, asynq.MaxRetry(1)),
	)

	if err != nil {
		panic(err)
	}
}
