package search

import (
	"wanderlust/internal/pkg/config"

	"github.com/typesense/typesense-go/v2/typesense"
)

type Search struct {
	Client *typesense.Client
}

func New(cfg *config.Configuration) *Search {
	var (
		serverUrl = cfg.GetString(config.SEARCH_SERVER_URL)
		apiKey    = cfg.GetString(config.SEARCH_API_KEY)
	)

	client := typesense.NewClient(
		typesense.WithServer(serverUrl),
		typesense.WithAPIKey(apiKey),
	)

	search := Search{
		Client: client,
	}

	search.CreateSchemas()

	return &search
}
