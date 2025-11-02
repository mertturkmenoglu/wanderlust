package collections

import "wanderlust/pkg/dto"

type (
	GetCollectionsInput struct {
		dto.PaginationQueryParams
	}

	GetCollectionsOutput struct {
		Body GetCollectionsOutputBody
	}

	GetCollectionsOutputBody struct {
		Collections []dto.Collection   `json:"collections"`
		Pagination  dto.PaginationInfo `json:"pagination"`
	}

	GetCollectionByIdInput struct {
		ID string `path:"id" validate:"required" doc:"ID of collection" example:"7323488942953598976"`
	}

	GetCollectionByIdOutput struct {
		Body GetCollectionByIdOutputBody
	}

	GetCollectionByIdOutputBody struct {
		Collection dto.Collection `json:"collection"`
	}

	CreateCollectionInput struct {
		Body CreateCollectionInputBody
	}

	CreateCollectionInputBody struct {
		Name        string `json:"name" example:"My collection" doc:"Name of the collection" minLength:"1" maxLength:"128"`
		Description string `json:"description" example:"My collection description" doc:"Description of the collection" minLength:"1" maxLength:"4096"`
	}

	CreateCollectionOutput struct {
		Body CreateCollectionOutputBody
	}

	CreateCollectionOutputBody struct {
		Collection dto.Collection `json:"collection"`
	}

	DeleteCollectionInput struct {
		ID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
	}

	DeleteCollectionOutput struct {
	}

	UpdateCollectionInput struct {
		ID   string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		Body UpdateCollectionInputBody
	}

	UpdateCollectionInputBody struct {
		Name        string `json:"name" example:"My collection" doc:"Name of the collection" minLength:"1" maxLength:"128"`
		Description string `json:"description" example:"My collection description" doc:"Description of the collection" minLength:"1" maxLength:"4096"`
	}

	UpdateCollectionOutput struct {
		Body UpdateCollectionOutputBody
	}

	UpdateCollectionOutputBody struct {
		Collection dto.Collection `json:"collection"`
	}

	CreateCollectionItemInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		Body         CreateCollectionItemInputBody
	}

	CreateCollectionItemInputBody struct {
		PlaceID string `json:"placeId" example:"7323488942953598976" doc:"ID of place" minLength:"1" maxLength:"32"`
	}

	CreateCollectionItemOutput struct {
		Body CreateCollectionItemOutputBody
	}

	CreateCollectionItemOutputBody struct {
		Collection dto.Collection `json:"collection"`
	}

	DeleteCollectionItemInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		Index        int32  `path:"index" doc:"Index of collection item" example:"1"`
	}

	DeleteCollectionItemOutput struct {
	}

	UpdateCollectionItemsInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		Body         UpdateCollectionItemsInputBody
	}

	UpdateCollectionItemsInputBody struct {
		NewOrder []NewOrderItem `json:"newOrder"`
	}

	NewOrderItem struct {
		ListIndex int32  `json:"listIndex" example:"1"`
		PlaceId   string `json:"placeId" example:"7323488942953598976"`
	}

	UpdateCollectionItemsOutput struct {
		Body UpdateCollectionItemsOutputBody
	}

	UpdateCollectionItemsOutputBody struct {
		Collection dto.Collection `json:"collection"`
	}

	CreateCollectionPlaceRelationInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		PlaceID      string `path:"placeId" doc:"ID of place" example:"7323488942953598976"`
	}

	CreateCollectionPlaceRelationOutput struct {
	}

	CreateCollectionCityRelationInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		CityID       int32  `path:"cityId" doc:"ID of city" example:"1"`
	}

	CreateCollectionCityRelationOutput struct {
	}

	RemoveCollectionPlaceRelationInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		PlaceID      string `path:"placeId" doc:"ID of place" example:"7323488942953598976"`
	}

	RemoveCollectionPlaceRelationOutput struct {
	}

	RemoveCollectionCityRelationInput struct {
		CollectionID string `path:"id" doc:"ID of collection" example:"7323488942953598976"`
		CityID       int32  `path:"cityId" doc:"ID of city" example:"1"`
	}

	RemoveCollectionCityRelationOutput struct {
	}

	GetCollectionsForPlaceInput struct {
		PlaceID string `path:"id" doc:"ID of place" example:"7323488942953598976"`
	}

	GetCollectionsForPlaceOutput struct {
		Body GetCollectionsForPlaceOutputBody
	}

	GetCollectionsForPlaceOutputBody struct {
		Collections []dto.Collection `json:"collections"`
	}

	GetCollectionsForCityInput struct {
		CityID int32 `path:"id" doc:"ID of city" example:"1"`
	}

	GetCollectionsForCityOutput struct {
		Body GetCollectionsForCityOutputBody
	}

	GetCollectionsForCityOutputBody struct {
		Collections []dto.Collection `json:"collections"`
	}

	GetAllPlaceCollectionsInput struct {
	}

	GetAllPlaceCollectionsOutput struct {
		Body GetAllPlaceCollectionsOutputBody
	}

	GetAllPlaceCollectionsOutputBody struct {
		Collections []dto.Collection `json:"collections"`
	}

	GetAllCityCollectionsInput struct {
	}

	GetAllCityCollectionsOutput struct {
		Body GetAllCityCollectionsOutputBody
	}

	GetAllCityCollectionsOutputBody struct {
		Collections []dto.Collection `json:"collections"`
	}
)
