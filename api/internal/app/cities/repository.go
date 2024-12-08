package cities

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func (r *repository) get(id int32) (db.City, error) {
	return r.di.Db.Queries.GetCityById(context.Background(), id)
}

func (r *repository) list() ([]db.City, error) {
	return r.di.Db.Queries.GetCities(context.Background())
}

func (r *repository) featured(cityIds []int32) ([]db.City, error) {
	return r.di.Db.Queries.GetFeaturedCities(context.Background(), cityIds)
}

func (r *repository) create(dto CreateReqDto) (db.City, error) {
	return r.di.Db.Queries.CreateCity(context.Background(), db.CreateCityParams{
		ID:             dto.ID,
		Name:           dto.Name,
		StateCode:      dto.StateCode,
		StateName:      dto.StateName,
		CountryCode:    dto.CountryCode,
		CountryName:    dto.CountryName,
		ImageUrl:       dto.ImageUrl,
		Latitude:       dto.Latitude,
		Longitude:      dto.Longitude,
		Description:    dto.Description,
		ImgLicense:     utils.StrToText(dto.ImageLicense),
		ImgLicenseLink: utils.StrToText(dto.ImageLicenseLink),
		ImgAttr:        utils.StrToText(dto.ImageAttribution),
		ImgAttrLink:    utils.StrToText(dto.ImageAttributionLink),
	})
}

func (r *repository) update(id int32, dto UpdateReqDto) (db.City, error) {
	return r.di.Db.Queries.UpdateCity(context.Background(), db.UpdateCityParams{
		ID:             id,
		Name:           dto.Name,
		StateCode:      dto.StateCode,
		StateName:      dto.StateName,
		CountryCode:    dto.CountryCode,
		CountryName:    dto.CountryName,
		ImageUrl:       dto.ImageUrl,
		Latitude:       dto.Latitude,
		Longitude:      dto.Longitude,
		Description:    dto.Description,
		ImgLicense:     utils.NilStrToText(dto.ImageLicense),
		ImgLicenseLink: utils.NilStrToText(dto.ImageLicenseLink),
		ImgAttr:        utils.NilStrToText(dto.ImageAttribution),
		ImgAttrLink:    utils.NilStrToText(dto.ImageAttributionLink),
	})
}

func (r *repository) remove(id int32) error {
	return r.di.Db.Queries.DeleteCity(context.Background(), id)
}
