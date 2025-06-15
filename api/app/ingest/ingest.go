package ingest

import (
	"encoding/json"
	"log"
	"os"
	"wanderlust/pkg/osm"
	"wanderlust/pkg/wiki"
	"wanderlust/pkg/wiki/wikidata"
	"wanderlust/pkg/wiki/wikimedia"
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

	wdc := wikidata.NewWikidataClient(wikidata.WithAlternativeLanguage("es"))
	wid, err := wiki.NewWikiID("Q48435") // Sagrada Familia

	if err != nil {
		log.Fatal(err)
	}

	wdcRes, err := wdc.Fetch(wid)

	if err != nil {
		log.Fatal(err)
	}

	lang, title, err := wdc.GetTitle(wdcRes)

	if err != nil {
		log.Fatal(err)
	}

	log.Println(title)

	ser, _ := json.Marshal(wdcRes)
	_ = os.WriteFile("tmp/Q48435.json", ser, 0600)

	wmc := wikimedia.NewWikimediaClient()
	wmcRes, err := wmc.Fetch(lang, title)

	if err != nil {
		log.Fatal(err)
	}

	ser, _ = json.Marshal(wmcRes)
	_ = os.WriteFile("tmp/Q48435.wikimedia.json", ser, 0600)

	sec, err := wiki.GetWikiTextFirstSection(wmcRes.Source)

	if err != nil {
		log.Fatal(err)
	}

	out, err := wiki.ConvertWikiTextToPlainText(sec)

	if err != nil {
		log.Fatal(err)
	}

	out = wiki.RemoveFootnotes(out)

	_ = os.WriteFile("tmp/Q48435.plaintext.txt", []byte(out), 0600)
}
