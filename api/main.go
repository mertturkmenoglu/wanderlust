package main

import (
	"wanderlust/app"
	"wanderlust/pkg/commands"
	"wanderlust/pkg/core"

	"github.com/danielgtaylor/huma/v2/humacli"
)

type Options struct {
	Port    int    `help:"Port to run the server on" default:"5000"`
	EnvFile string `help:"Path to the .env file" default:".env"`
}

func main() {
	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		core.LoadEnv(options.EnvFile)

		w := core.New()
		w.SetupEcho()
		w.Routing(app.Modules...)

		hooks.OnStart(func() {
			w.StartServer()
		})

		hooks.OnStop(func() {
			w.StopServer()
		})
	})

	cli.Root().AddCommand(commands.Commands...)

	cli.Run()
}
