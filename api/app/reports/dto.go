package reports

import "wanderlust/pkg/dto"

type GetReportByIdInput struct {
	ID string `path:"id" example:"564457817990234127" doc:"ID of the report"`
}

type GetReportByIdOutput struct {
	Body GetReportByIdOutputBody
}

type GetReportByIdOutputBody struct {
	Report dto.Report `json:"report"`
}

type GetReportsInput struct {
	dto.PaginationQueryParams
}

type GetReportsOutput struct {
	Body GetReportsOutputBody
}

type GetReportsOutputBody struct {
	Reports    []dto.Report       `json:"reports"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type SearchReportsInput struct {
	dto.PaginationQueryParams
	ReporterID   string `query:"reporterId" example:"564457817990234127" doc:"ID of the reporter"`
	ResourceType string `query:"resourceType" example:"poi" doc:"Type of the resource"`
	Reason       int32  `query:"reason" example:"1" doc:"Reason for the report"`
	Resolved     bool   `query:"resolved" example:"false" doc:"Whether the report is resolved"`
}

type SearchReportsOutput struct {
	Body SearchReportsOutputBody
}

type SearchReportsOutputBody struct {
	Reports    []dto.Report       `json:"reports"`
	Pagination dto.PaginationInfo `json:"pagination"`
}

type CreateReportInput struct {
	Body CreateReportInputBody
}

type CreateReportInputBody struct {
	ResourceID   string `json:"resourceId" example:"564457817990234127" doc:"ID of the resource"`
	ResourceType string `json:"resourceType" example:"poi" doc:"Type of the resource"`
	Description  string `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the report"`
	Reason       int32  `json:"reason" example:"1" doc:"Reason for the report"`
}

type CreateReportOutput struct {
	Body CreateReportOutputBody
}

type CreateReportOutputBody struct {
	Report dto.Report `json:"report"`
}

type DeleteReportInput struct {
	ID string `path:"id" example:"564457817990234127" doc:"ID of the report"`
}

type DeleteReportOutput struct {
}

type UpdateReportInput struct {
	ID   string `path:"id" example:"564457817990234127" doc:"ID of the report"`
	Body UpdateReportInputBody
}

type UpdateReportInputBody struct {
	Description string `json:"description" example:"Lorem ipsum dolor sit amet" doc:"Description of the report"`
	Reason      int32  `json:"reason" example:"1" doc:"Reason for the report"`
	Resolved    bool   `json:"resolved" example:"false" doc:"Whether the report is resolved"`
}

type UpdateReportOutput struct {
	Body UpdateReportOutputBody
}

type UpdateReportOutputBody struct {
	Report dto.Report `json:"report"`
}
