package ingest

import (
	"fmt"
	"log"
	"wanderlust/pkg/osm"
)

func Ingest() {
	osmData, err := osm.ReadFromFile("tmp/map.xml")

	if err != nil {
		log.Fatal(err)
	}

	osmData.FilterNodes()
	osmData.FilterRelations()

	err = osm.WriteToFile(osmData)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("osm nodes", len(osmData.Nodes))
	fmt.Println("osm relations", len(osmData.Relations))
}
