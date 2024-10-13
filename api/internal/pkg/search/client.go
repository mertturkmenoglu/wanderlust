package search

import (
	"wanderlust/config"

	"github.com/spf13/viper"
	"github.com/typesense/typesense-go/v2/typesense"
)

type Search struct {
	Client *typesense.Client
}

func New() *Search {
	serverUrl := viper.GetString(config.SEARCH_SERVER_URL)
	apiKey := viper.GetString(config.SEARCH_API_KEY)
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
