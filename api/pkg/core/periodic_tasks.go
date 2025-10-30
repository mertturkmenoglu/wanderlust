package core

import (
	"wanderlust/pkg/tasks"

	"github.com/hibiken/asynq"
)

func (s *Server) RegisterPeriodicTasks() {
	_, err := s.app.Tasks.Schedule(
		cronFor(tasks.TypeFindExpiredTripInvites),
		asynq.NewTask(tasks.TypeFindExpiredTripInvites, []byte{}, asynq.MaxRetry(1)),
	)

	if err != nil {
		panic(err)
	}
}
