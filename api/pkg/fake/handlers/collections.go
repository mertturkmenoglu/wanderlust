package handlers

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/fake/fakeutils"
	"wanderlust/pkg/id"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/sony/sonyflake"
)

func (f *Fake) HandleCollections(count int) error {
	step := 1000
	ctx := context.Background()
	idgen := id.NewGenerator(sonyflake.NewSonyflake(sonyflake.Settings{}))

	if count < step {
		step = count
	}

	for i := 0; i < count; i += step {
		if i+step >= count {
			step = count - i
		}

		batch := make([]db.BatchCreateCollectionsParams, 0, step)

		for range step {
			batch = append(batch, db.BatchCreateCollectionsParams{
				ID:          idgen.Flake(),
				Name:        gofakeit.Name(),
				Description: gofakeit.Paragraph(10, 8, 6, " "),
			})
		}

		_, err := f.db.Queries.BatchCreateCollections(ctx, batch)

		if err != nil {
			return err
		}
	}

	return nil
}

func (f *Fake) HandleCollectionItems(collectionPath string, poiPath string) error {
	ctx := context.Background()
	collectionIds, err := fakeutils.ReadFile(collectionPath)

	if err != nil {
		return err
	}

	poiIds, err := fakeutils.ReadFile(poiPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateCollectionItemsParams, 0, 10*len(collectionIds))

	for _, collectionId := range collectionIds {
		pois := fakeutils.RandElems(poiIds, 10)

		for i, poiId := range pois {
			batch = append(batch, db.BatchCreateCollectionItemsParams{
				CollectionID: collectionId,
				PoiID:        poiId,
				Index:        int32(i + 1),
			})
		}
	}

	_, err = f.db.Queries.BatchCreateCollectionItems(ctx, batch)

	return err
}

func (f *Fake) HandleCollectionsCities(collectionPath string) error {
	ctx := context.Background()
	collectionIds, err := fakeutils.ReadFile(collectionPath)

	if err != nil {
		return err
	}

	cities, err := f.db.Queries.GetCities(ctx)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateCollectionCityRelationsParams, 0, 10*len(cities))

	for _, city := range cities {
		collections := fakeutils.RandElems(collectionIds, 10)

		for i, collectionId := range collections {
			batch = append(batch, db.BatchCreateCollectionCityRelationsParams{
				CollectionID: collectionId,
				CityID:       city.ID,
				Index:        int32(i + 1),
			})
		}
	}

	_, err = f.db.Queries.BatchCreateCollectionCityRelations(ctx, batch)

	return err
}

func (f *Fake) HandleCollectionsPois(collectionPath string, poisPath string) error {
	ctx := context.Background()
	collectionIds, err := fakeutils.ReadFile(collectionPath)

	if err != nil {
		return err
	}

	poiIds, err := fakeutils.ReadFile(poisPath)

	if err != nil {
		return err
	}

	batch := make([]db.BatchCreateCollectionPoiRelationsParams, 0, 5*len(poiIds))

	for _, poiId := range poiIds {
		collections := fakeutils.RandElems(collectionIds, 5)

		for i, collectionId := range collections {
			batch = append(batch, db.BatchCreateCollectionPoiRelationsParams{
				CollectionID: collectionId,
				PoiID:        poiId,
				Index:        int32(i + 1),
			})
		}
	}

	_, err = f.db.Queries.BatchCreateCollectionPoiRelations(ctx, batch)

	return err
}
