package favorites

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) createFavorite(poiId string, userId string) (db.Favorite, error) {
	return r.db.Queries.CreateFavorite(context.Background(), db.CreateFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (r *repository) deleteFavoriteByPoiId(poiId string, userId string) error {
	return r.db.Queries.DeleteFavoriteByPoiId(context.Background(), db.DeleteFavoriteByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (r *repository) getUserFavorites(userId string, offset int, limit int) ([]db.GetFavoritesByUserIdRow, error) {
	return r.db.Queries.GetFavoritesByUserId(context.Background(), db.GetFavoritesByUserIdParams{
		UserID: userId,
		Offset: int32(offset),
		Limit:  int32(limit),
	})
}

func (r *repository) countUserFavorites(userId string) (int64, error) {
	return r.db.Queries.CountUserFavorites(context.Background(), userId)
}
