package dto

import "time"

type List struct {
	ID        string     `json:"id" example:"7323488942953598976" doc:"ID of the list"`
	Name      string     `json:"name" example:"My List" doc:"Name of the list"`
	UserID    string     `json:"userId" example:"7323488942953598976" doc:"ID of the user that owns the list"`
	User      ListUser   `json:"user"`
	Items     []ListItem `json:"items"`
	IsPublic  bool       `json:"isPublic" example:"true" doc:"Whether the list is public or not"`
	CreatedAt time.Time  `json:"createdAt" example:"2021-01-01T00:00:00Z" doc:"Date and time when the list was created"`
	UpdatedAt time.Time  `json:"updatedAt" example:"2021-01-01T00:00:00Z" doc:"Date and time when the list was last updated"`
}

type ListUser struct {
	ID           string  `json:"id" example:"7323488942953598976" doc:"ID of the user"`
	Username     string  `json:"username" example:"johndoe" doc:"Username of the user"`
	FullName     string  `json:"fullName" example:"John Doe" doc:"Full name of the user"`
	ProfileImage *string `json:"profileImage" example:"https://example.com/profile.jpg" doc:"Profile image of the user" required:"true"`
}

type ListItem struct {
	ListID    string      `json:"listId"`
	PoiID     string      `json:"poiId"`
	Poi       ListItemPoi `json:"poi"`
	ListIndex int32       `json:"listIndex"`
	CreatedAt time.Time   `json:"createdAt"`
}

type ListItemPoi struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	AddressID  int32    `json:"addressId"`
	Address    Address  `json:"address"`
	CategoryID int16    `json:"categoryId"`
	Category   Category `json:"category"`
	FirstMedia Media    `json:"firstMedia"`
}

type ListStatus struct {
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of the list"`
	Name     string `json:"name" example:"My List" doc:"Name of the list"`
	Includes bool   `json:"includes" example:"true" doc:"Whether the POI is included in the list"`
}

//
// Requests
//

type GetAllListsOfUserInput struct {
	PaginationQueryParams
}

type GetAllListsOfUserOutput struct {
	Body GetAllListsOfUserOutputBody
}

type GetAllListsOfUserOutputBody struct {
	Lists      []List         `json:"lists"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetPublicListsOfUserInput struct {
	Username string `path:"username" required:"true" minLength:"1" maxLength:"128"`
	PaginationQueryParams
}

type GetPublicListsOfUserOutput struct {
	Body GetPublicListsOfUserOutputBody
}

type GetPublicListsOfUserOutputBody struct {
	Lists      []List         `json:"lists"`
	Pagination PaginationInfo `json:"pagination"`
}

type GetListByIdInput struct {
	ID string `path:"id" required:"true" minLength:"1" maxLength:"128"`
}

type GetListByIdOutput struct {
	Body GetListByIdOutputBody
}

type GetListByIdOutputBody struct {
	List List `json:"list"`
}

type GetListStatusesInput struct {
	PoiID string `path:"poiId" required:"true" minLength:"1" maxLength:"128"`
}

type GetListStatusesOutput struct {
	Body GetListStatusesOutputBody
}

type GetListStatusesOutputBody struct {
	Statuses []ListStatus `json:"statuses"`
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
	List List `json:"list"`
}

type DeleteListInput struct {
	ID string `path:"id" required:"true" minLength:"1" maxLength:"128"`
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
	List List `json:"list"`
}

type CreateListItemInput struct {
	ID   string `path:"id" required:"true" minLength:"1" maxLength:"128"`
	Body CreateListItemInputBody
}

type CreateListItemInputBody struct {
	PoiID string `json:"poiId" required:"true" minLength:"1" maxLength:"128"`
}

type CreateListItemOutput struct {
	Body CreateListItemOutputBody
}

type CreateListItemOutputBody struct {
	ListID    string    `json:"listId" example:"7323488942953598976" doc:"ID of the list"`
	PoiID     string    `json:"poiId" example:"7323488942953598976" doc:"ID of the POI"`
	ListIndex int32     `json:"listIndex" example:"1" doc:"Index of the POI in the list"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of list item"`
}

type UpdateListItemsInput struct {
	ID   string `path:"id" required:"true" minLength:"1" maxLength:"128"`
	Body UpdateListItemsInputBody
}

type UpdateListItemsInputBody struct {
	PoiIds []string `json:"poiIds" required:"true" minItems:"0" maxItems:"256" uniqueItems:"true"`
}

type UpdateListItemsOutput struct {
	Body UpdateListItemsOutputBody
}

type UpdateListItemsOutputBody struct {
	List List `json:"list"`
}
