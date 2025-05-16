package search

import (
	"wanderlust/pkg/cfg"

	"github.com/typesense/typesense-go/v2/typesense"
)

type Search struct {
	Client *typesense.Client
}

func New() *Search {
	client := typesense.NewClient(
		typesense.WithServer(cfg.Env.SearchServerURL),
		typesense.WithAPIKey(cfg.Env.SearchAPIKey),
	)

	search := Search{
		Client: client,
	}

	search.CreateSchemas()

	return &search
}
