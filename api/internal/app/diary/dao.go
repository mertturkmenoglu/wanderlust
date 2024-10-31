package diary

import "wanderlust/internal/pkg/db"

type GetDiaryEntryByIdDao struct {
	DiaryEntry db.GetDiaryEntryByIdRow
	Users      []db.GetDiaryEntryUsersRow
	Pois       []db.GetDiaryEntryPoisRow
	Media      []db.DiaryMedium
}
