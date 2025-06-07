package core

import (
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/tasks"
)

type cronspecvalues struct {
	dev  string
	prod string
}

var cronspecs = map[string]cronspecvalues{
	tasks.TypeFindExpiredTripInvites: {
		dev:  "@every 1m",
		prod: "@every 5m",
	},
}

func cronFor(taskType string) string {
	cronValue, ok := cronspecs[taskType]

	if !ok {
		panic("unknown task type")
	}

	if cfg.Env.Env == "dev" {
		return cronValue.dev
	}

	return cronValue.prod
}
