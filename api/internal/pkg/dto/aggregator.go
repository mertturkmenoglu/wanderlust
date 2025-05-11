package dto

type HomeAggregatorOutput struct {
	Body HomeAggregatorOutputBody
}

type HomeAggregatorOutputBody struct {
	New       []HomeAggregatorPoi `json:"new"`
	Popular   []HomeAggregatorPoi `json:"popular"`
	Featured  []HomeAggregatorPoi `json:"featured"`
	Favorites []HomeAggregatorPoi `json:"favorites"`
}

type HomeAggregatorPoi struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	AddressID  int32    `json:"addressId"`
	Address    Address  `json:"address"`
	CategoryID int16    `json:"categoryId"`
	Category   Category `json:"category"`
	FirstMedia Media    `json:"media"`
}
