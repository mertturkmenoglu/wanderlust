package reports

import (
	"context"
	"wanderlust/pkg/dto"
)

func canRead(ctx context.Context, report *dto.Report) bool {
	userId := ctx.Value("userId").(string)
	role := ctx.Value("role").(string)

	if role == "admin" {
		return true
	}

	return report.ReporterID != nil && *report.ReporterID == userId
}
