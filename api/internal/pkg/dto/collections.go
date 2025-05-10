package dto

import "time"

type Collection struct {
	ID          string           `json:"id" example:"7323488942953598976" doc:"ID of collection"`
	Name        string           `json:"name" example:"My collection" doc:"Name of collection"`
	Description string           `json:"description" example:"My collection description" doc:"Description of collection"`
	CreatedAt   string           `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of collection"`
	Items       []CollectionItem `json:"items"`
}

type CollectionItem struct {
	CollectionID string    `json:"collectionId" example:"7323488942953598976" doc:"ID of collection"`
	PoiID        string    `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest"`
	ListIndex    int32     `json:"listIndex" example:"1" doc:"Index of collection item in the list"`
	Poi          Poi       `json:"poi"`
	CreatedAt    time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of collection item"`
}

type GetCollectionsInput struct {
	PaginationQueryParams
}

type GetCollectionsOutput struct {
	Body GetCollectionsOutputBody
}

type GetCollectionsOutputBody struct {
	Collections []Collection   `json:"collections"`
	Pagination  PaginationInfo `json:"pagination"`
}

type GetCollectionByIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of collection" example:"7323488942953598976"`
}

type GetCollectionByIdOutput struct {
	Body GetCollectionByIdOutputBody
}

type GetCollectionByIdOutputBody struct {
	Collection Collection `json:"collection"`
}

type CreateCollectionInput struct {
	Body CreateCollectionInputBody
}

type CreateCollectionInputBody struct {
	Name        string `json:"name" example:"My collection" doc:"Name of the collection" minLength:"1" maxLength:"128"`
	Description string `json:"description" example:"My collection description" doc:"Description of the collection" minLength:"1" maxLength:"4096"`
}

type CreateCollectionOutput struct {
	Body CreateCollectionOutputBody
}

type CreateCollectionOutputBody struct {
	Collection Collection `json:"collection"`
}

type DeleteCollectionInput struct {
	ID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
}

type UpdateCollectionInput struct {
	ID   string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	Body UpdateCollectionInputBody
}

type UpdateCollectionInputBody struct {
	Name        string `json:"name" example:"My collection" doc:"Name of the collection" minLength:"1" maxLength:"128"`
	Description string `json:"description" example:"My collection description" doc:"Description of the collection" minLength:"1" maxLength:"4096"`
}

type UpdateCollectionOutput struct {
	Body UpdateCollectionOutputBody
}

type UpdateCollectionOutputBody struct {
	Collection Collection `json:"collection"`
}

type CreateCollectionItemInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	Body         CreateCollectionItemInputBody
}

type CreateCollectionItemInputBody struct {
	PoiID string `json:"poiId" example:"7323488942953598976" doc:"ID of point of interest" minLength:"1" maxLength:"32"`
}

type CreateCollectionItemOutput struct {
	Body CreateCollectionItemOutputBody
}

type CreateCollectionItemOutputBody struct {
	Collection Collection `json:"collection"`
}

type DeleteCollectionItemInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	Index        int32  `path:"index" doc:"Index of collection item" example:"1"`
}

type UpdateCollectionItemsInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	Body         UpdateCollectionItemsInputBody
}

type UpdateCollectionItemsInputBody struct {
	NewOrder []NewOrderItem `json:"newOrder"`
}

type NewOrderItem struct {
	ListIndex int32  `json:"listIndex" example:"1"`
	PoiID     string `json:"poiId" example:"7323488942953598976"`
}

type UpdateCollectionItemsOutput struct {
	Body UpdateCollectionItemsOutputBody
}

type UpdateCollectionItemsOutputBody struct {
	Collection Collection `json:"collection"`
}

type CreateCollectionPoiRelationInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	PoiID        string `path:"poiId" doc:"ID of point of interest" example:"7323488942953598976"`
}

type CreateCollectionCityRelationInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	CityID       int32  `path:"cityId" doc:"ID of city" example:"1"`
}

type RemoveCollectionPoiRelationInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	PoiID        string `path:"poiId" doc:"ID of point of interest" example:"7323488942953598976"`
}

type RemoveCollectionCityRelationInput struct {
	CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	CityID       int32  `path:"cityId" doc:"ID of city" example:"1"`
}

type GetCollectionsForPoiInput struct {
	PoiID string `path:"id" doc:"ID of point of interest" example:"7323488942953598976"`
}

type GetCollectionsForPoiOutput struct {
	Body GetCollectionsForPoiOutputBody
}

type GetCollectionsForPoiOutputBody struct {
	Collections []Collection `json:"collections"`
}

type GetCollectionsForCityInput struct {
	CityID int32 `path:"id" doc:"ID of city" example:"1"`
}

type GetCollectionsForCityOutput struct {
	Body GetCollectionsForCityOutputBody
}

type GetCollectionsForCityOutputBody struct {
	Collections []Collection `json:"collections"`
}

type GetAllPoiCollectionsOutput struct {
	Body GetAllPoiCollectionsOutputBody
}

type GetAllPoiCollectionsOutputBody struct {
	Collections []Collection `json:"collections"`
}

type GetAllCityCollectionsOutput struct {
	Body GetAllCityCollectionsOutputBody
}

type GetAllCityCollectionsOutputBody struct {
	Collections []Collection `json:"collections"`
}
