package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToBookmark(dbBookmark db.Bookmark, poi dto.Poi) dto.Bookmark {
	return dto.Bookmark{
		ID:        dbBookmark.ID,
		PoiID:     dbBookmark.PoiID,
		Poi:       poi,
		UserID:    dbBookmark.UserID,
		CreatedAt: dbBookmark.CreatedAt.Time,
	}
}
