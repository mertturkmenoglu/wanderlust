package collections

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapToGetCollectionByIdResponseDto(collection db.Collection, items []db.GetCollectionItemsRow) GetCollectionByIdResponseDto {
	itemsArr := make([]CollectionItemDto, 0)

	for _, item := range items {
		itemsArr = append(itemsArr, CollectionItemDto{
			CollectionID: collection.ID,
			PoiID:        item.Poi.ID,
			CreatedAt:    item.Poi.CreatedAt.Time,
			Poi: CollectionItemPoiDto{
				ID:          item.Poi.ID,
				Name:        item.Poi.Name,
				Description: item.Poi.Description,
				AddressID:   item.Poi.AddressID,
				CategoryID:  item.Poi.CategoryID,
				CreatedAt:   item.Poi.CreatedAt.Time,
				UpdatedAt:   item.Poi.UpdatedAt.Time,
				Address: CollectionItemPoiAddressDto{
					ID:     item.Address.ID,
					CityID: item.Address.CityID,
					City: CollectionItemPoiAddressCityDto{
						ID:          item.City.ID,
						Name:        item.City.Name,
						StateCode:   item.City.StateCode,
						StateName:   item.City.StateName,
						CountryCode: item.City.CountryCode,
						CountryName: item.City.CountryName,
						ImageUrl:    item.City.ImageUrl,
						Latitude:    item.City.Latitude,
						Longitude:   item.City.Longitude,
						Description: item.City.Description,
					},
					Line1:      item.Address.Line1,
					Line2:      utils.TextOrNil(item.Address.Line2),
					PostalCode: utils.TextOrNil(item.Address.PostalCode),
					Lat:        item.Address.Lat,
					Lng:        item.Address.Lng,
				},
				Category: CollectionItemPoiCategoryDto{
					ID:    item.Category.ID,
					Name:  item.Category.Name,
					Image: item.Category.Image,
				},
			},
		})
	}

	return GetCollectionByIdResponseDto{
		ID:          collection.ID,
		Name:        collection.Name,
		Description: collection.Description,
		CreatedAt:   collection.CreatedAt.Time,
		Items:       itemsArr,
	}
}

func mapToGetCollectionsResponseDto(collections []db.Collection) GetCollectionsResponseDto {
	dtoArr := make([]CollectionDto, 0)

	for _, collection := range collections {
		dtoArr = append(dtoArr, CollectionDto{
			ID:          collection.ID,
			Name:        collection.Name,
			Description: collection.Description,
			CreatedAt:   collection.CreatedAt.Time,
		})
	}

	return GetCollectionsResponseDto{
		Collections: dtoArr,
	}
}
