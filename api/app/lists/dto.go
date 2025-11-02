package lists

import (
	"time"
	"wanderlust/pkg/dto"
)

type GetAllListsOfUserInput struct {
	dto.PaginationQueryParams
}

type GetAllListsOfUserOutput struct {
	Body GetAllListsOfUserOutputBody
}

type GetAllListsOfUserOutputBody struct {
	Lists      []dto.List         `json:"lists"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type GetListByIdInput struct {
	ID string `path:"id" required:"true" minLength:"1" maxLength:"128"`
}

type GetListByIdOutput struct {
	Body GetListByIdOutputBody
}

type GetListByIdOutputBody struct {
	List dto.List `json:"list"`
}

type GetListStatusesInput struct {
	PoiID string `path:"poiId" required:"true" minLength:"1" maxLength:"128"`
}

type GetListStatusesOutput struct {
	Body GetListStatusesOutputBody
}

type GetListStatusesOutputBody struct {
	Statuses []dto.ListStatus `json:"statuses"`
}

type GetPublicListsOfUserInput struct {
	Username string `path:"username" required:"true" minLength:"1" maxLength:"128"`
	dto.PaginationQueryParams
}

type GetPublicListsOfUserOutput struct {
	Body GetPublicListsOfUserOutputBody
}

type GetPublicListsOfUserOutputBody struct {
	Lists      []dto.List         `json:"lists"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type CreateListInput struct {
	Body CreateListInputBody
}

type CreateListInputBody struct {
	Name     string `json:"name" required:"true" minLength:"1" maxLength:"128"`
	IsPublic bool   `json:"isPublic" required:"true"`
}

type CreateListOutput struct {
	Body CreateListOutputBody
}

type CreateListOutputBody struct {
	List dto.List `json:"list"`
}

type UpdateListInput struct {
	ID   string `path:"id" required:"true" minLength:"1" maxLength:"128"`
	Body UpdateListInputBody
}

type UpdateListInputBody struct {
	Name     string `json:"name" required:"true" minLength:"1" maxLength:"128"`
	IsPublic bool   `json:"isPublic" required:"true"`
}

type UpdateListOutput struct {
	Body UpdateListOutputBody
}

type UpdateListOutputBody struct {
	List dto.List `json:"list"`
}

type DeleteListInput struct {
	ID string `path:"id" required:"true" minLength:"1" maxLength:"128"`
}

type DeleteListOutput struct {
}

type CreateListItemInput struct {
	ID   string `path:"id" required:"true" minLength:"1" maxLength:"128"`
	Body CreateListItemInputBody
}

type CreateListItemInputBody struct {
	PlaceID string `json:"placeId" required:"true" minLength:"1" maxLength:"128"`
}

type CreateListItemOutput struct {
	Body CreateListItemOutputBody
}

type CreateListItemOutputBody struct {
	ListID    string    `json:"listId" example:"7323488942953598976" doc:"ID of the list"`
	PlaceID   string    `json:"placeId" example:"7323488942953598976" doc:"ID of the Place"`
	Index     int32     `json:"index" example:"1" doc:"Index of the Place in the list"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of list item"`
}

type UpdateListItemsInput struct {
	ID   string `path:"id" required:"true" minLength:"1" maxLength:"128"`
	Body UpdateListItemsInputBody
}

type UpdateListItemsInputBody struct {
	PlaceIDs []string `json:"placeIds" required:"true" minItems:"0" maxItems:"256" uniqueItems:"true"`
}

type UpdateListItemsOutput struct {
	Body UpdateListItemsOutputBody
}

type UpdateListItemsOutputBody struct {
	List dto.List `json:"list"`
}
