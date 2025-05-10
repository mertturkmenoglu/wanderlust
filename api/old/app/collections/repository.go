package collections

import (
	"context"
	"wanderlust/internal/pkg/db"
)

func (r *repository) createCollectionPoiRelation(id string, poiId string) error {
	return r.di.Db.Queries.CreateCollectionPoiRelation(context.Background(), db.CreateCollectionPoiRelationParams{
		CollectionID: id,
		PoiID:        poiId,
		Index:        0,
	})
}

func (r *repository) createCollectionCityRelation(id string, cityId int32) error {
	return r.di.Db.Queries.CreateCollectionCityRelation(context.Background(), db.CreateCollectionCityRelationParams{
		CollectionID: id,
		CityID:       cityId,
		Index:        0,
	})
}

func (r *repository) removeCollectionPoiRelation(id string, poiId string) error {
	return r.di.Db.Queries.RemoveCollectionPoiRelation(context.Background(), db.RemoveCollectionPoiRelationParams{
		CollectionID: id,
		PoiID:        poiId,
	})
}

func (r *repository) removeCollectionCityRelation(id string, cityId int32) error {
	return r.di.Db.Queries.RemoveCollectionCityRelation(context.Background(), db.RemoveCollectionCityRelationParams{
		CollectionID: id,
		CityID:       cityId,
	})
}

func (r *repository) getCollectionIdsForPoi(id string) ([]string, error) {
	return r.di.Db.Queries.GetCollectionIdsForPoi(context.Background(), id)
}

func (r *repository) getCollectionIdsForCity(id int32) ([]string, error) {
	return r.di.Db.Queries.GetCollectionsIdsForCity(context.Background(), id)
}

func (r *repository) getAllPoiCollections() ([]db.CollectionsPoi, error) {
	return r.di.Db.Queries.GetAllPoiCollections(context.Background())
}

func (r *repository) getAllCityCollections() ([]db.CollectionsCity, error) {
	return r.di.Db.Queries.GetAllCityCollections(context.Background())
}
