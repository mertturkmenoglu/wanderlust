package dto

type HomeAggregatorOutput struct {
	Body HomeAggregatorOutputBody
}

type HomeAggregatorOutputBody struct {
	New       []Poi `json:"new"`
	Popular   []Poi `json:"popular"`
	Featured  []Poi `json:"featured"`
	Favorites []Poi `json:"favorites"`
}
