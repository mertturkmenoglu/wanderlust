package aggregator

import "wanderlust/pkg/dto"

type HomeAggregatorInput struct {
}

type HomeAggregatorOutput struct {
	Body HomeAggregatorOutputBody
}

type HomeAggregatorOutputBody struct {
	New       []dto.Place `json:"new"`
	Popular   []dto.Place `json:"popular"`
	Featured  []dto.Place `json:"featured"`
	Favorites []dto.Place `json:"favorites"`
}
