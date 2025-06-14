package wikidata

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strings"
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

func (wdc *Client) GetTitle(res *Response) (string, string, error) {
	id := ""

	for k := range res.Entities {
		id = k
		break
	}

	sitelinks := res.Entities[id].SiteLinks

	enlink, ok := sitelinks["enwiki"]

	if ok {
		url, err := wdc.getTitleFromUrl(enlink.Url)

		if err != nil {
			return "", "", fmt.Errorf("error getting title from url: %w", err)
		}

		return "en", url, nil
	}

	key := fmt.Sprintf("%swiki", wdc.altlang)
	link, ok := sitelinks[key]

	if ok {
		url, err := wdc.getTitleFromUrl(link.Url)

		if err != nil {
			return "", "", fmt.Errorf("error getting title from url: %w", err)
		}

		return wdc.altlang, url, nil
	}

	return "", "", errors.New("no default or alternative site link found")
}

func (wdc *Client) getTitleFromUrl(url string) (string, error) {
	_, after, found := strings.Cut(url, "wiki/")

	if !found {
		return "", fmt.Errorf("url does not contain 'wiki/'")
	}

	return after, nil
}
