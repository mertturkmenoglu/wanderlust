package main

import (
	"wanderlust/cmd/core/bootstrap"
)

func main() {
	bootstrap.LoadEnv()
	w := bootstrap.New()
	w.SetupEcho()
	w.Routing()
	w.StartServer()
}
