package main

import (
	"wanderlust/app/aggregator"
	"wanderlust/app/amenities"
	"wanderlust/app/auth"
	"wanderlust/app/bookmarks"
	"wanderlust/app/categories"
	"wanderlust/app/cities"
	"wanderlust/app/collections"
	"wanderlust/app/diaries"
	"wanderlust/app/favorites"
	"wanderlust/app/health"
	"wanderlust/app/images"
	"wanderlust/app/lists"
	"wanderlust/app/pois"
	"wanderlust/app/reports"
	"wanderlust/app/reviews"
	"wanderlust/app/trips"
	"wanderlust/app/users"
	"wanderlust/pkg/commands"
	"wanderlust/pkg/core"

	"github.com/danielgtaylor/huma/v2/humacli"
)

type Options struct {
	Port    int    `help:"Port to run the server on" default:"5000"`
	EnvFile string `help:"Path to the .env file" default:".env"`
}

var routes = []core.RegisterFunc{
	aggregator.Register,
	amenities.Register,
	auth.Register,
	bookmarks.Register,
	categories.Register,
	cities.Register,
	collections.Register,
	diaries.Register,
	favorites.Register,
	health.Register,
	images.Register,
	lists.Register,
	pois.Register,
	reports.Register,
	reviews.Register,
	trips.Register,
	users.Register,
}

func main() {
	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		core.LoadEnv(options.EnvFile)

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

	cli.Root().AddCommand(commands.Commands...)

	cli.Run()
}
