package osm

import "encoding/xml"

type Data struct {
	XMLName   xml.Name   `xml:"osm"`
	Nodes     []Node     `xml:"node"`
	Relations []Relation `xml:"relation"`
}

type Node struct {
	Lat  float64 `xml:"lat,attr"`
	Lon  float64 `xml:"lon,attr"`
	Tags []Tag   `xml:"tag"`
}

type Relation struct {
	ID   int   `xml:"id,attr"`
	Tags []Tag `xml:"tag"`
}

type Tag struct {
	K string `xml:"k,attr"`
	V string `xml:"v,attr"`
}

type Member struct {
	Type string `xml:"type,attr"`
	Ref  string `xml:"ref,attr"`
	Role string `xml:"role,attr"`
}
