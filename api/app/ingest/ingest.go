package ingest

import (
	"encoding/json"
	"log"
	"os"
	"wanderlust/pkg/wiki"
	"wanderlust/pkg/wiki/wikidata"
	"wanderlust/pkg/wiki/wikimedia"
)

func Ingest() {
	// osmData, err := readOsmData("tmp/map.xml")

	// if err != nil {
	// 	log.Fatal(err)
	// }

	// nodes := filterNodes(osmData.Nodes)
	// relations := filterRelations(osmData.Relations)

	// out := OsmData{
	// 	Nodes:     nodes,
	// 	Relations: relations,
	// }

	// err = writeFilteredOsmData(out)

	// if err != nil {
	// 	log.Fatal(err)
	// }

	wdc := wikidata.NewWikidataClient(wikidata.WithAlternativeLanguage("es"))
	wid, err := wiki.NewWikiID("Q48435") // Sagrada Familia

	if err != nil {
		log.Fatal(err)
	}

	res, err := wdc.Fetch(wid)

	if err != nil {
		log.Fatal(err)
	}

	lang, title, err := wdc.GetTitle(res)

	if err != nil {
		log.Fatal(err)
	}

	log.Println(title)

	ser, _ := json.Marshal(res)
	os.WriteFile("tmp/Q48435.json", ser, 0644)

	wmc := wikimedia.NewWikimediaClient()
	wmcRes, err := wmc.Fetch(lang, title)

	if err != nil {
		log.Fatal(err)
	}

	ser, _ = json.Marshal(wmcRes)
	os.WriteFile("tmp/Q48435.wikimedia.json", ser, 0644)
}
