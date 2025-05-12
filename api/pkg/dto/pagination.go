package dto

type PaginationQueryParams struct {
	Page     int `query:"page" required:"false" default:"1" minimum:"1" example:"2" doc:"Page number"`
	PageSize int `query:"pageSize" required:"false" default:"10" minimum:"10" maximum:"100" multipleOf:"10" example:"20" doc:"Page size"`
}

type PaginationInfo struct {
	Page         int   `json:"page" example:"1" doc:"Page number"`
	PageSize     int   `json:"pageSize" example:"10" doc:"Page size"`
	TotalRecords int64 `json:"totalRecords" example:"100" doc:"Total records"`
	TotalPages   int64 `json:"totalPages" example:"10" doc:"Total pages"`
	HasPrevious  bool  `json:"hasPrevious" example:"false" doc:"Has previous page"`
	HasNext      bool  `json:"hasNext" example:"true" doc:"Has next page"`
}
