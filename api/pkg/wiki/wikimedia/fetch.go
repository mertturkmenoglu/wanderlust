package wikimedia

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
)

func (wmc *Client) Fetch(lang string, title string) (*Response, error) {
	un, err := url.QueryUnescape(title)

	if err != nil {
		return nil, fmt.Errorf("error unescaping title: %w", err)
	}

	u := fmt.Sprintf(wmc.urlFmt, lang, un)

	resp, err := wmc.httpClient.Get(u)

	log.Println(u)

	if err != nil {
		return nil, fmt.Errorf("error fetching wikimedia information: %w", err)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, fmt.Errorf("error reading wikimedia response body: %w", err)
	}

	var wikimediaResponse Response

	err = json.Unmarshal(body, &wikimediaResponse)

	if err != nil {
		return nil, fmt.Errorf("error unmarshalling wikimedia response: %w", err)
	}

	return &wikimediaResponse, nil
}
