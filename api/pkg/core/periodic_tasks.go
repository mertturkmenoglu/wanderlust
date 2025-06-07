package core

import (
	"wanderlust/pkg/tasks"

	"github.com/hibiken/asynq"
)

func (w *Wanderlust) RegisterPeriodicTasks() {
	_, err := w.app.Tasks.Schedule("@every 1m", asynq.NewTask(tasks.TypeFindExpiredTripInvites, []byte{}, asynq.MaxRetry(1)))

	if err != nil {
		panic(err)
	}
}
