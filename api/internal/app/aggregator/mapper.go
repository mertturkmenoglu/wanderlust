package aggregator

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

type Row struct {
	Poi      db.Poi
	Category db.Category
	Address  db.Address
	City     db.City
	Medium   db.Medium
}

func mapRow(row Row) HomeAggregatorPoi {
	return HomeAggregatorPoi{
		ID:        row.Poi.ID,
		Name:      row.Poi.Name,
		AddressID: row.Poi.AddressID,
		Address: HomeAggregatorPoiAddress{
			ID:     row.Address.ID,
			CityID: row.Address.CityID,
			City: HomeAggregatorPoiCity{
				ID:          row.City.ID,
				Name:        row.City.Name,
				StateCode:   row.City.StateCode,
				StateName:   row.City.StateName,
				CountryCode: row.City.CountryCode,
				CountryName: row.City.CountryName,
				ImageUrl:    row.City.ImageUrl,
				Latitude:    row.City.Latitude,
				Longitude:   row.City.Longitude,
				Description: row.City.Description,
			},
			Line1:      row.Address.Line1,
			Line2:      utils.TextOrNil(row.Address.Line2),
			PostalCode: utils.TextOrNil(row.Address.PostalCode),
			Lat:        row.Address.Lat,
			Lng:        row.Address.Lng,
		},
		CategoryID: row.Category.ID,
		Category: HomeAggregatorPoiCategory{
			ID:    row.Category.ID,
			Name:  row.Category.Name,
			Image: row.Category.Image,
		},
		FirstMedia: HomeAggregatorPoiMedia{
			ID:         row.Medium.ID,
			PoiID:      row.Medium.PoiID,
			Url:        row.Medium.Url,
			Alt:        row.Medium.Alt,
			Caption:    utils.TextOrNil(row.Medium.Caption),
			MediaOrder: row.Medium.MediaOrder,
			CreatedAt:  row.Medium.CreatedAt.Time,
		},
	}
}

func mapGetHomeAggregationDaoToDto(dao GetHomeAggregationDao) HomeAggregatorResponseDto {
	return HomeAggregatorResponseDto{
		New:       mapGetNewPoisRowsToDto(dao.new),
		Popular:   mapGetPopularPoisRowsToDto(dao.popular),
		Featured:  mapGetFeaturedPoisRowsToDto(dao.featured),
		Favorites: mapGetFavoritePoisRowsToDto(dao.favorites),
	}
}

func mapGetNewPoisRowsToDto(rows []db.GetNewPoisRow) []HomeAggregatorPoi {
	var pois []HomeAggregatorPoi

	for _, row := range rows {
		pois = append(pois, mapRow(Row{
			Poi:      row.Poi,
			Category: row.Category,
			Address:  row.Address,
			City:     row.City,
			Medium:   row.Medium,
		}))
	}

	return pois
}

func mapGetPopularPoisRowsToDto(rows []db.GetPopularPoisRow) []HomeAggregatorPoi {
	var pois []HomeAggregatorPoi

	for _, row := range rows {
		pois = append(pois, mapRow(Row{
			Poi:      row.Poi,
			Category: row.Category,
			Address:  row.Address,
			City:     row.City,
			Medium:   row.Medium,
		}))
	}

	return pois
}

func mapGetFeaturedPoisRowsToDto(rows []db.GetFeaturedPoisRow) []HomeAggregatorPoi {
	var pois []HomeAggregatorPoi

	for _, row := range rows {
		pois = append(pois, mapRow(Row{
			Poi:      row.Poi,
			Category: row.Category,
			Address:  row.Address,
			City:     row.City,
			Medium:   row.Medium,
		}))
	}

	return pois
}

func mapGetFavoritePoisRowsToDto(rows []db.GetFavoritePoisRow) []HomeAggregatorPoi {
	var pois []HomeAggregatorPoi

	for _, row := range rows {
		pois = append(pois, mapRow(Row{
			Poi:      row.Poi,
			Category: row.Category,
			Address:  row.Address,
			City:     row.City,
			Medium:   row.Medium,
		}))
	}

	return pois
}
