package lists

import "wanderlust/internal/db"

func mapToCreateListResponseDto(v db.List) CreateListResponseDto {
	return CreateListResponseDto{
		ID:        v.ID,
		Name:      v.Name,
		UserID:    v.UserID,
		IsPublic:  v.IsPublic,
		CreatedAt: v.CreatedAt.Time,
		UpdatedAt: v.UpdatedAt.Time,
	}
}
