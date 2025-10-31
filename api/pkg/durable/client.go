package durable

import "github.com/inngest/inngestgo"

type Durable struct {
	Client *inngestgo.Client
}

func New() *Durable {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "wl-api",
		Env:   inngestgo.StrPtr("dev"),
		Dev:   inngestgo.BoolPtr(true),
	})

	if err != nil {
		panic(err)
	}

	// Register functions
	for _, fn := range functions {
		_, err = fn(client)
		if err != nil {
			panic(err)
		}
	}

	return &Durable{
		Client: &client,
	}
}
