package ingest

import "encoding/xml"

type OsmData struct {
	XMLName   xml.Name      `xml:"osm"`
	Nodes     []OsmNode     `xml:"node"`
	Relations []OsmRelation `xml:"relation"`
}

type OsmNode struct {
	Lat  float64  `xml:"lat,attr"`
	Lon  float64  `xml:"lon,attr"`
	Tags []OsmTag `xml:"tag"`
}

type OsmRelation struct {
	ID   int      `xml:"id,attr"`
	Tags []OsmTag `xml:"tag"`
}

type OsmTag struct {
	K string `xml:"k,attr"`
	V string `xml:"v,attr"`
}

type OsmMember struct {
	Type string `xml:"type,attr"`
	Ref  string `xml:"ref,attr"`
	Role string `xml:"role,attr"`
}
