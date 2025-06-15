package wikidata

import (
	"encoding/json"
	"fmt"
	"io"
	"wanderlust/pkg/wiki"
)

func (wdc *Client) Fetch(wikiId *wiki.WikiID) (*Response, error) {
	urlFmt := "https://www.wikidata.org/wiki/Special:EntityData/%s.json"
	url := fmt.Sprintf(urlFmt, wikiId.String())

	resp, err := wdc.httpClient.Get(url)

	if err != nil {
		return nil, fmt.Errorf("error fetching wikidata information: %w", err)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, fmt.Errorf("error reading wikidata response body: %w", err)
	}

	var wikidataResponse Response

	err = json.Unmarshal(body, &wikidataResponse)

	if err != nil {
		return nil, fmt.Errorf("error unmarshalling wikidata response: %w", err)
	}

	return &wikidataResponse, nil
}
