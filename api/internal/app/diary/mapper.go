package diary

import "wanderlust/internal/pkg/db"

func mapToCreateDiaryEntryResponseDto(v db.DiaryEntry) CreateDiaryEntryResponseDto {
	return CreateDiaryEntryResponseDto{
		ID:               v.ID,
		UserID:           v.UserID,
		Title:            v.Title,
		Description:      v.Description,
		ShareWithFriends: v.ShareWithFriends,
		Date:             v.Date.Time,
		CreatedAt:        v.CreatedAt.Time,
		UpdatedAt:        v.UpdatedAt.Time,
	}
}
