package search

import (
	"context"
	"log"
	"strings"
)

func (s *Search) CreateSchemas() {
	for _, schema := range schemas {
		_, err := s.Client.Collections().Create(context.Background(), schema)

		if err != nil {
			// We don't care if the schema already exists
			existsErr := strings.ContainsAny(err.Error(), "already exists")

			if !existsErr {
				log.Fatal(err.Error())
			}
		}
	}
}
