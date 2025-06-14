package wikidata

import "net/http"

type Client struct {
	altlang    string
	httpClient *http.Client
}

type ClientOption func(*Client)

func WithAlternativeLanguage(altlang string) ClientOption {
	return func(wdm *Client) {
		wdm.altlang = altlang
	}
}

func WithHttpClient(httpClient *http.Client) ClientOption {
	return func(wdm *Client) {
		wdm.httpClient = httpClient
	}
}

func NewWikidataClient(opts ...ClientOption) *Client {
	wdc := &Client{}

	for _, opt := range opts {
		opt(wdc)
	}

	if wdc.httpClient == nil {
		wdc.httpClient = http.DefaultClient
	}

	if wdc.altlang == "" {
		wdc.altlang = "es"
	}

	return wdc
}
