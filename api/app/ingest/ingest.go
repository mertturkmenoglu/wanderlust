package ingest

import (
	_ "embed"
	"encoding/json"
	"encoding/xml"
	"log"
	"os"
)

type OsmData struct {
	XMLName xml.Name `xml:"osm"`
	Nodes   []Node   `xml:"node"`
}

type Node struct {
	Lat  float64 `xml:"lat,attr"`
	Lon  float64 `xml:"lon,attr"`
	Tags []Tag   `xml:"tag"`
}

type Tag struct {
	K string `xml:"k,attr"`
	V string `xml:"v,attr"`
}

func Ingest() {
	var osmData OsmData

	log.Println("Starting")
	log.Println("Reading file")
	f, err := os.ReadFile("tmp/map.xml")

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Start unmarshaling xml")

	err = xml.Unmarshal([]byte(f), &osmData)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Done unmarshaling xml")

	fi, _ := os.Create("tmp/ingest_test.json")
	defer fi.Close()

	nodes := make([]Node, 0)

	log.Println("Start Filtering")

	for _, node := range osmData.Nodes {
		if len(node.Tags) == 0 {
			continue
		}

		flag := 0

		for _, tag := range node.Tags {
			if tag.K == "name" {
				flag++
			}

			if tag.K == "wikidata" {
				flag++
			}

			if tag.K == "public_transport" && tag.V == "stop_position" {
				flag--
			}

			if flag == 2 {
				break
			}
		}

		if flag != 2 {
			continue
		}

		nodes = append(nodes, node)
	}

	asXml, err := xml.MarshalIndent(nodes, "", "  ")

	if err != nil {
		log.Println("xml err: ", err)
	}

	err = os.WriteFile("tmp/ingest_test.xml", asXml, 0644)

	if err != nil {
		log.Println("xml err: ", err)
	}

	log.Println("Writing file")
	log.Println("Length: ", len(nodes))

	bytes, _ := json.Marshal(nodes)
	fi.Write(bytes)
	log.Println("Done")
}
