package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/utils"
)

func ToListWithoutItems(dbList db.List, dbUser db.User) dto.List {
	return dto.List{
		ID:     dbList.ID,
		Name:   dbList.Name,
		UserID: dbList.UserID,
		User: dto.ListUser{
			ID:           dbUser.ID,
			Username:     dbUser.Username,
			FullName:     dbUser.FullName,
			ProfileImage: utils.TextToStr(dbUser.ProfileImage),
		},
		Items:     []dto.ListItem{},
		IsPublic:  dbList.IsPublic,
		CreatedAt: dbList.CreatedAt.Time,
		UpdatedAt: dbList.UpdatedAt.Time,
	}
}

func ToListsWithoutItems(dbLists []db.List, dbUser db.User) []dto.List {
	lists := make([]dto.List, len(dbLists))

	for i, v := range dbLists {
		lists[i] = ToListWithoutItems(v, dbUser)
	}

	return lists
}

func ToListWithItems(dbList db.GetListByIdRow, dbItems []db.GetListItemsRow, pois []dto.Poi) dto.List {
	list := dto.List{
		ID:     dbList.List.ID,
		Name:   dbList.List.Name,
		UserID: dbList.List.UserID,
		User: dto.ListUser{
			ID:           dbList.List.UserID,
			Username:     dbList.Profile.Username,
			FullName:     dbList.Profile.FullName,
			ProfileImage: utils.TextToStr(dbList.Profile.ProfileImage),
		},
		Items:     make([]dto.ListItem, len(dbItems)),
		IsPublic:  dbList.List.IsPublic,
		CreatedAt: dbList.List.CreatedAt.Time,
		UpdatedAt: dbList.List.UpdatedAt.Time,
	}

	for i, v := range dbItems {
		var poi *dto.Poi

		for _, p := range pois {
			if p.ID == v.ListItem.PoiID {
				poi = &p
				break
			}
		}

		if poi == nil {
			continue
		}

		list.Items[i] = dto.ListItem{
			ListID:    v.ListItem.ListID,
			PoiID:     v.ListItem.PoiID,
			Index:     v.ListItem.Index,
			CreatedAt: v.ListItem.CreatedAt.Time,
			Poi:       *poi,
		}
	}

	return list
}
