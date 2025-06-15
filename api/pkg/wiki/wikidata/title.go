package wikidata

import (
	"errors"
	"fmt"
	"strings"
)

func (wdc *Client) GetTitle(res *Response) (string, string, error) {
	id := ""

	for k := range res.Entities {
		id = k
		break
	}

	sitelinks := res.Entities[id].SiteLinks

	enlink, ok := sitelinks["enwiki"]

	if ok {
		url, err := getTitleFromUrl(enlink.Url)

		if err != nil {
			return "", "", fmt.Errorf("error getting title from url: %w", err)
		}

		return "en", url, nil
	}

	key := fmt.Sprintf("%swiki", wdc.altlang)
	link, ok := sitelinks[key]

	if ok {
		url, err := getTitleFromUrl(link.Url)

		if err != nil {
			return "", "", fmt.Errorf("error getting title from url: %w", err)
		}

		return wdc.altlang, url, nil
	}

	return "", "", errors.New("no default or alternative site link found")
}

func getTitleFromUrl(url string) (string, error) {
	_, after, found := strings.Cut(url, "wiki/")

	if !found {
		return "", fmt.Errorf("url does not contain 'wiki/'")
	}

	return after, nil
}
