package mapper

import (
	"time"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/utils"
)

func ToReport(r db.Report) dto.Report {
	var resolvedAt *time.Time = nil

	if r.ResolvedAt.Valid {
		resolvedAt = &r.ResolvedAt.Time
	}

	return dto.Report{
		ID:           r.ID,
		ResourceID:   r.ResourceID,
		ResourceType: r.ResourceType,
		ReporterID:   utils.TextToStr(r.ReporterID),
		Description:  utils.TextToStr(r.Description),
		Reason:       r.Reason,
		Resolved:     r.Resolved,
		ResolvedAt:   resolvedAt,
		CreatedAt:    r.CreatedAt.Time,
		UpdatedAt:    r.UpdatedAt.Time,
	}
}
