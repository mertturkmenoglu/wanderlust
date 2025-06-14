package wikimedia

type Response struct {
	ID           int64   `json:"id"`
	Key          string  `json:"key"`
	Title        string  `json:"title"`
	ContentModel string  `json:"content_model"`
	License      License `json:"license"`
	Source       string  `json:"source"`
}

type License struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}
