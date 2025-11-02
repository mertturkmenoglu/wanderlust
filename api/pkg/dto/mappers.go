package dto

import (
	"encoding/json"
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

func ToListWithoutItems(dbList db.List, dbUser db.Profile) List {
	return List{
		ID:     dbList.ID,
		Name:   dbList.Name,
		UserID: dbList.UserID,
		User: ListUser{
			ID:           dbUser.ID,
			Username:     dbUser.Username,
			FullName:     dbUser.FullName,
			ProfileImage: utils.TextToStr(dbUser.ProfileImage),
		},
		Items:     []ListItem{},
		IsPublic:  dbList.IsPublic,
		CreatedAt: dbList.CreatedAt.Time,
		UpdatedAt: dbList.UpdatedAt.Time,
	}
}

func ToListsWithoutItems(dbLists []db.List, dbUser db.Profile) []List {
	lists := make([]List, len(dbLists))

	for i, v := range dbLists {
		lists[i] = ToListWithoutItems(v, dbUser)
	}

	return lists
}

func ToListWithItems(dbList db.FindListByIdRow, dbItems []db.FindManyListItemsRow, places []Place) List {
	list := List{
		ID:     dbList.List.ID,
		Name:   dbList.List.Name,
		UserID: dbList.List.UserID,
		User: ListUser{
			ID:           dbList.List.UserID,
			Username:     dbList.Profile.Username,
			FullName:     dbList.Profile.FullName,
			ProfileImage: utils.TextToStr(dbList.Profile.ProfileImage),
		},
		Items:     make([]ListItem, len(dbItems)),
		IsPublic:  dbList.List.IsPublic,
		CreatedAt: dbList.List.CreatedAt.Time,
		UpdatedAt: dbList.List.UpdatedAt.Time,
	}

	for i, v := range dbItems {
		var place *Place

		for _, p := range places {
			if p.ID == v.ListItem.PlaceID {
				place = &p
				break
			}
		}

		if place == nil {
			continue
		}

		list.Items[i] = ListItem{
			ListID:    v.ListItem.ListID,
			PlaceID:   v.ListItem.PlaceID,
			Index:     v.ListItem.Index,
			CreatedAt: v.ListItem.CreatedAt.Time,
			Place:     *place,
		}
	}

	return list
}

func ToPlaces(data []byte) ([]Place, error) {
	if len(data) == 0 {
		return []Place{}, nil
	}

	var places []Place

	err := json.Unmarshal(data, &places)

	if err != nil {
		return nil, err
	}

	for i, p := range places {
		if p.Hours == nil {
			places[i].Hours = make(map[string]*string)
		}

		if p.Amenities == nil {
			places[i].Amenities = make(map[string]*string)
		}

		if p.Assets == nil {
			places[i].Assets = []Asset{}
		}
	}

	return places, nil
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
