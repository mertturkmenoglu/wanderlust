package osm

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"os"
)

func ReadFromFile(path string) (*Data, error) {
	var osmData Data

	f, err := os.ReadFile(path)

	if err != nil {
		return nil, fmt.Errorf("error reading file: %w", err)
	}

	err = xml.Unmarshal([]byte(f), &osmData)

	if err != nil {
		return nil, fmt.Errorf("error unmarshalling xml: %w", err)
	}

	return &osmData, nil
}

func WriteToFile(data any) error {
	asXml, err := xml.MarshalIndent(data, "", "  ")

	if err != nil {
		return fmt.Errorf("xml marshal error: %w", err)
	}

	err = os.WriteFile("tmp/ingest_test.xml", asXml, 0600)

	if err != nil {
		return fmt.Errorf("xml write error: %w", err)
	}

	asJson, err := json.Marshal(data)

	if err != nil {
		return fmt.Errorf("json marshal error: %w", err)
	}

	err = os.WriteFile("tmp/ingest_test.json", asJson, 0600)

	if err != nil {
		return fmt.Errorf("json write error: %w", err)
	}

	return nil
}
