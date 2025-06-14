package wikidata

type Response struct {
	Entities map[string]Entity `json:"entities"`
}

type Entity struct {
	PageID    int64               `json:"pageid"`
	Title     string              `json:"title"`
	Type      string              `json:"type"`
	ID        string              `json:"id"`
	SiteLinks map[string]SiteLink `json:"sitelinks"`
}

type SiteLink struct {
	Site  string `json:"site"`
	Title string `json:"title"`
	Url   string `json:"url"`
}
