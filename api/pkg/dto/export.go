package dto

import (
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type ExportTaskMetadata struct {
	ID        string    `json:"id" example:"7323488942953598976" doc:"ID of export"`
	CreatedAt time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of export"`
	Status    string    `json:"status" example:"pending" doc:"Status of export"`
	Progress  int32     `json:"progress" example:"0" doc:"Progress of export"`
	Error     *string   `json:"error" example:"Failed to export" doc:"Error of export"`
	File      *string   `json:"file" example:"https://example.com/export.zip" doc:"File of export"`
	IDs       []string  `json:"ids" doc:"IDs of exported data"`
	Include   []string  `json:"include" doc:"Which data to include"`
}

type StartNewExportTaskInput struct {
	Body StartNewExportTaskInputBody
}

type StartNewExportTaskInputBody struct {
	PoiIds  []string `json:"poiIds" validate:"required" doc:"IDs of the POIs to export" minItems:"1" maxItems:"16000" uniqueItems:"true"`
	Include []string `json:"include" validate:"required" doc:"Which data to include" minItems:"1" maxItems:"8" uniqueItems:"true"`
}

func (body *StartNewExportTaskInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	validIncludes := [...]string{"image", "address"}

	for _, include := range body.Include {
		flag := false

		for _, validInclude := range validIncludes {
			if include == validInclude {
				flag = true
				break
			}
		}

		if !flag {
			return []error{&huma.ErrorDetail{
				Message:  "Invalid include",
				Location: prefix.With("include"),
				Value:    include,
			}}
		}
	}

	return nil
}

type StartNewExportTaskOutput struct {
	Body StartNewExportTaskOutputBody
}

type StartNewExportTaskOutputBody struct {
	Task ExportTaskMetadata `json:"task"`
}
