package wikimedia

import "net/http"

type Client struct {
	httpClient *http.Client
	urlFmt     string
}

type ClientOption func(*Client)

func WithHttpClient(httpClient *http.Client) ClientOption {
	return func(wmc *Client) {
		wmc.httpClient = httpClient
	}
}

func NewWikimediaClient(opts ...ClientOption) *Client {
	wmc := &Client{}

	for _, opt := range opts {
		opt(wmc)
	}

	if wmc.httpClient == nil {
		wmc.httpClient = http.DefaultClient
	}

	wmc.urlFmt = "https://api.wikimedia.org/core/v1/wikipedia/%s/page/%s"

	return wmc
}
