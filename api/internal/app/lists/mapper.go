package lists

import (
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapToCreateListResponseDto(v db.List) CreateListResponseDto {
	return CreateListResponseDto{
		ID:        v.ID,
		Name:      v.Name,
		UserID:    v.UserID,
		IsPublic:  v.IsPublic,
		CreatedAt: v.CreatedAt.Time,
		UpdatedAt: v.UpdatedAt.Time,
	}
}

func mapToGetListByIdResponseDto(list db.GetListByIdRow, listItems []db.GetListItemsRow) GetListByIdResponseDto {
	return GetListByIdResponseDto{
		ID:        list.List.ID,
		Name:      list.List.Name,
		UserID:    list.List.UserID,
		IsPublic:  list.List.IsPublic,
		CreatedAt: list.List.CreatedAt.Time,
		UpdatedAt: list.List.UpdatedAt.Time,
		User: ListUserDto{
			ID:           list.User.ID,
			Username:     list.User.Username,
			FullName:     list.User.FullName,
			ProfileImage: utils.TextOrNil(list.User.ProfileImage),
		},
		Items: mapListItemsToDto(listItems),
	}
}

func mapListItemsToDto(listItems []db.GetListItemsRow) []ListItemDto {
	listItemsArr := make([]ListItemDto, 0)

	for _, item := range listItems {
		listItemsArr = append(listItemsArr, ListItemDto{
			ListID:    item.ListItem.ListID,
			PoiID:     item.ListItem.PoiID,
			ListIndex: item.ListItem.ListIndex,
			CreatedAt: item.ListItem.CreatedAt.Time,
			Poi: ListItemPoiDto{
				ID:          item.Poi.ID,
				Name:        item.Poi.Name,
				Description: item.Poi.Description,
				AddressID:   item.Poi.AddressID,
				CategoryID:  item.Poi.CategoryID,
				CreatedAt:   item.Poi.CreatedAt.Time,
				UpdatedAt:   item.Poi.UpdatedAt.Time,
				Address: ListItemPoiAddressDto{
					ID:     item.Address.ID,
					CityID: item.Address.CityID,
					City: ListItemPoiAddressCityDto{
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
				Category: ListItemPoiCategoryDto{
					ID:    item.Category.ID,
					Name:  item.Category.Name,
					Image: item.Category.Image,
				},
				FirstMedia: ListItemPoiMedia{
					ID:         item.Medium.ID,
					PoiID:      item.Poi.ID,
					Url:        item.Medium.Url,
					Alt:        item.Medium.Alt,
					Caption:    utils.TextOrNil(item.Medium.Caption),
					MediaOrder: item.Medium.MediaOrder,
					CreatedAt:  item.Medium.CreatedAt.Time,
				},
			},
		})
	}

	return listItemsArr
}

func mapToGetAllListsOfUserDto(v []db.List) GetAllListsOfUserDto {
	lists := make([]ListDto, 0)

	for _, list := range v {
		lists = append(lists, ListDto{
			ID:        list.ID,
			Name:      list.Name,
			UserID:    list.UserID,
			IsPublic:  list.IsPublic,
			CreatedAt: list.CreatedAt.Time,
			UpdatedAt: list.UpdatedAt.Time,
		})
	}

	return GetAllListsOfUserDto{
		Lists: lists,
	}
}

func mapToGetPublicListsOfUserDto(v []db.List) GetPublicListsOfUserDto {
	lists := make([]ListDto, 0)

	for _, list := range v {
		lists = append(lists, ListDto{
			ID:        list.ID,
			Name:      list.Name,
			UserID:    list.UserID,
			IsPublic:  list.IsPublic,
			CreatedAt: list.CreatedAt.Time,
			UpdatedAt: list.UpdatedAt.Time,
		})
	}

	return GetPublicListsOfUserDto{
		Lists: lists,
	}
}

func mapToCreateListItemResponseDto(v db.ListItem) CreateListItemResponseDto {
	return CreateListItemResponseDto{
		ListID:    v.ListID,
		PoiID:     v.PoiID,
		ListIndex: v.ListIndex,
		CreatedAt: v.CreatedAt.Time,
	}
}

func mapToGetListStatusResponseDto(v []ListStatusDto) GetListStatusResponseDto {
	return GetListStatusResponseDto{
		Statuses: v,
	}
}
