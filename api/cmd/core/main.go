package main

import (
	"wanderlust/pkg/core"

	"github.com/danielgtaylor/huma/v2/humacli"
)

type Options struct {
	Port int `help:"Port to run the server on" default:"5000"`
}

func main() {
	core.LoadEnv()

	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		w := core.New()
		w.SetupEcho()
		w.Routing(routes...)

		hooks.OnStart(func() {
			w.StartServer()
		})

		hooks.OnStop(func() {
			w.StopServer()
		})
	})

	cli.Run()
}
