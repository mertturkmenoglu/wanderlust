package cities

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapGetCityByIdRowToDto(v db.GetCityByIdRow) GetCityByIdResponseDto {
	return GetCityByIdResponseDto{
		ID:   v.City.ID,
		Name: v.City.Name,
		State: State{
			ID:        v.State.ID,
			Name:      v.State.Name,
			StateCode: v.State.StateCode,
			Type:      utils.TextOrNil(v.State.Type),
			Latitude:  v.State.Latitude,
			Longitude: v.State.Longitude,
		},
		Country: Country{
			ID:             v.Country.ID,
			Name:           v.Country.Name,
			Iso2:           v.Country.Iso2,
			NumericCode:    v.Country.NumericCode,
			PhoneCode:      v.Country.PhoneCode,
			Capital:        v.Country.Capital,
			Currency:       v.Country.Currency,
			CurrencyName:   v.Country.CurrencyName,
			CurrencySymbol: v.Country.CurrencySymbol,
			Tld:            v.Country.Tld,
			Native:         v.Country.Native,
			Region:         v.Country.Region,
			Subregion:      v.Country.Subregion,
			Timezones:      v.Country.Timezones,
			Latitude:       v.Country.Latitude,
			Longitude:      v.Country.Longitude,
		},
		Latitude:   v.City.Latitude,
		Longitude:  v.City.Longitude,
		WikiDataID: v.City.WikiDataID,
	}
}
