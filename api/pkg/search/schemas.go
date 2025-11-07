package search

import (
	tsapi "github.com/typesense/typesense-go/v2/typesense/api"
	"github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

type CollectionName string

const (
	CollectionPlaces CollectionName = "places"
)

var schemas = []*tsapi.CollectionSchema{
	{
		Name:               string(CollectionPlaces),
		EnableNestedFields: pointer.True(),
		Fields: []tsapi.Field{
			{
				Name: "name",
				Type: "string",
			},
			{
				Name: "location",
				Type: "geopoint",
			},
			{
				Name:  "place",
				Type:  "object",
				Facet: pointer.True(),
				Index: pointer.True(),
			},
		},
	},
}
