package mapper

import (
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToCollection(dbCollection db.GetCollectionsRow) (dto.Collection, error) {
	items := make([]dto.CollectionItem, 0)

	if len(dbCollection.Items) > 0 {
		err := json.Unmarshal(dbCollection.Items, &items)

		if err != nil {
			return dto.Collection{}, err
		}
	}

	pois, err := ToPois(dbCollection.Pois)

	if err != nil {
		return dto.Collection{}, err
	}

	for i, item := range items {
		var poi *dto.Poi

		for _, p := range pois {
			if p.ID == item.PoiID {
				poi = &p
				break
			}
		}

		if poi == nil {
			return dto.Collection{}, fmt.Errorf("poi not found: %s", item.PoiID)
		}

		items[i].Poi = *poi
	}

	return dto.Collection{
		ID:          dbCollection.Collection.ID,
		Name:        dbCollection.Collection.Name,
		Description: dbCollection.Collection.Description,
		CreatedAt:   dbCollection.Collection.CreatedAt.Time,
		Items:       items,
	}, nil
}
