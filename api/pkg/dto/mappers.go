package dto

import (
	"time"
	"wanderlust/pkg/db"
	"wanderlust/pkg/utils"
)

func ToAddress(dbAddress db.Address, dbCity db.City) Address {
	return Address{
		ID:         dbAddress.ID,
		CityID:     dbAddress.CityID,
		City:       ToCity(dbCity),
		Line1:      dbAddress.Line1,
		Line2:      utils.TextToStr(dbAddress.Line2),
		PostalCode: utils.TextToStr(dbAddress.PostalCode),
		Lat:        dbAddress.Lat,
		Lng:        dbAddress.Lng,
	}
}

func ToBookmark(dbBookmark db.Bookmark, place Place) Bookmark {
	return Bookmark{
		ID:        dbBookmark.ID,
		PlaceID:   dbBookmark.PlaceID,
		Place:     place,
		UserID:    dbBookmark.UserID,
		CreatedAt: dbBookmark.CreatedAt.Time,
	}
}

func ToCategory(dbCategory db.Category) Category {
	return Category{
		ID:    dbCategory.ID,
		Name:  dbCategory.Name,
		Image: dbCategory.Image,
	}
}

func ToCity(dbCity db.City) City {
	return City{
		ID:   dbCity.ID,
		Name: dbCity.Name,
		State: CityState{
			Code: dbCity.StateCode,
			Name: dbCity.StateName,
		},
		Country: CityCountry{
			Code: dbCity.CountryCode,
			Name: dbCity.CountryName,
		},
		Image:       dbCity.Image,
		Lat:         dbCity.Lat,
		Lng:         dbCity.Lng,
		Description: dbCity.Description,
	}
}

func ToFavorite(dbFavorite db.Favorite, place Place) Favorite {
	return Favorite{
		PlaceID:   dbFavorite.PlaceID,
		Place:     place,
		UserID:    dbFavorite.UserID,
		CreatedAt: dbFavorite.CreatedAt.Time,
	}
}

func ToReport(r db.Report) Report {
	var resolvedAt *time.Time = nil

	if r.ResolvedAt.Valid {
		resolvedAt = &r.ResolvedAt.Time
	}

	return Report{
		ID:           r.ID,
		ResourceID:   r.ResourceID,
		ResourceType: r.ResourceType,
		ReporterID:   utils.TextToStr(r.ReporterID),
		Description:  utils.TextToStr(r.Description),
		Reason:       r.Reason,
		Resolved:     r.Resolved,
		ResolvedAt:   resolvedAt,
		CreatedAt:    r.CreatedAt.Time,
		UpdatedAt:    r.UpdatedAt.Time,
	}
}
