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
		typesense.WithServer(cfg.Get(cfg.API_SEARCH_SERVER_URL)),
		typesense.WithAPIKey(cfg.Get(cfg.API_SEARCH_API_KEY)),
	)

	search := Search{
		Client: client,
	}

	search.CreateSchemas()

	return &search
}
