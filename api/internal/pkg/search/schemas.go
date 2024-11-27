package search

import (
	tsapi "github.com/typesense/typesense-go/v2/typesense/api"
	"github.com/typesense/typesense-go/v2/typesense/api/pointer"
)

type CollectionName string

const (
	CollectionPois CollectionName = "pois"
)

var schemas = []*tsapi.CollectionSchema{
	{
		Name:               string(CollectionPois),
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
				Name:  "poi",
				Type:  "object",
				Facet: pointer.True(),
				Index: pointer.True(),
			},
		},
	},
}
