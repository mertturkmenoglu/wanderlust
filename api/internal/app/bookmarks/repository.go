package bookmarks

import (
	"context"
	"wanderlust/internal/pkg/db"
)

func (r *repository) createBookmark(poiId string, userId string) (db.Bookmark, error) {
	return r.di.Db.Queries.CreateBookmark(context.Background(), db.CreateBookmarkParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (r *repository) deleteBookmarkByPoiId(poiId string, userId string) error {
	return r.di.Db.Queries.DeleteBookmarkByPoiId(context.Background(), db.DeleteBookmarkByPoiIdParams{
		PoiID:  poiId,
		UserID: userId,
	})
}

func (r *repository) getUserBookmarks(userId string, offset int, limit int) ([]db.GetBookmarksByUserIdRow, error) {
	return r.di.Db.Queries.GetBookmarksByUserId(context.Background(), db.GetBookmarksByUserIdParams{
		UserID: userId,
		Offset: int32(offset),
		Limit:  int32(limit),
	})
}

func (r *repository) countUserBookmarks(userId string) (int64, error) {
	return r.di.Db.Queries.CountUserBookmarks(context.Background(), userId)
}
