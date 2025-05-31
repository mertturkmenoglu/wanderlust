package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToFavorite(dbFavorite db.Favorite, poi dto.Poi) dto.Favorite {
	return dto.Favorite{
		ID:        dbFavorite.ID,
		PoiID:     dbFavorite.PoiID,
		Poi:       poi,
		UserID:    dbFavorite.UserID,
		CreatedAt: dbFavorite.CreatedAt.Time,
	}
}
