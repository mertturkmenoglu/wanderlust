package cities

import (
	"context"
	"errors"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
)

type Service struct {
	app *core.Application
}

func (s *Service) list() (*dto.CitiesListOutput, error) {
	dbCities, err := s.app.Db.Queries.GetCities(context.Background())

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("No cities found")
		}

		return nil, huma.Error500InternalServerError("Internal server error")
	}

	cities := make([]dto.City, len(dbCities))

	for i, dbCity := range dbCities {
		cities[i] = dto.City{
			ID:          dbCity.ID,
			Name:        dbCity.Name,
			Description: dbCity.Description,
			State: dto.CityState{
				Name: dbCity.StateName,
				Code: dbCity.StateCode,
			},
			Country: dto.CityCountry{
				Name: dbCity.CountryName,
				Code: dbCity.CountryCode,
			},
			Image: dto.CityImage{
				Url:             dbCity.ImageUrl,
				License:         utils.TextToStr(dbCity.ImgLicense),
				LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
				Attribution:     utils.TextToStr(dbCity.ImgAttr),
				AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
			},
			Coordinates: dto.CityCoordinates{
				Latitude:  dbCity.Latitude,
				Longitude: dbCity.Longitude,
			},
		}
	}

	return &dto.CitiesListOutput{
		Body: dto.CitiesListOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) featured() (*dto.CitiesFeaturedOutput, error) {
	featuredCitiesIds := []int32{
		1106, // Salzburg
		1108, // Vienna
		1109, // Istanbul
		2300, // Athens
		3012, // Rome
		3014, // Turin
		3015, // Florence
		3016, // Venice
		4010, // Prague
		5010, // Amsterdam
		6010, // Paris
		7010, // Barcelona
	}

	dbFeaturedCities, err := s.app.Db.Queries.GetFeaturedCities(context.Background(), featuredCitiesIds)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("No featured cities found")
		}

		return nil, huma.Error500InternalServerError("Internal server error")
	}

	cities := make([]dto.City, len(dbFeaturedCities))

	for i, dbCity := range dbFeaturedCities {
		cities[i] = dto.City{
			ID:          dbCity.ID,
			Name:        dbCity.Name,
			Description: dbCity.Description,
			State: dto.CityState{
				Name: dbCity.StateName,
				Code: dbCity.StateCode,
			},
			Country: dto.CityCountry{
				Name: dbCity.CountryName,
				Code: dbCity.CountryCode,
			},
			Image: dto.CityImage{
				Url:             dbCity.ImageUrl,
				License:         utils.TextToStr(dbCity.ImgLicense),
				LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
				Attribution:     utils.TextToStr(dbCity.ImgAttr),
				AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
			},
			Coordinates: dto.CityCoordinates{
				Latitude:  dbCity.Latitude,
				Longitude: dbCity.Longitude,
			},
		}
	}

	return &dto.CitiesFeaturedOutput{
		Body: dto.CitiesFeaturedOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) get(id int32) (*dto.GetCityByIdOutput, error) {
	res, err := s.app.Db.Queries.GetCityById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("City not found")
		}

		return nil, huma.Error500InternalServerError("Internal server error")
	}

	city := dto.GetCityByIdOutputBody{
		ID:          res.ID,
		Name:        res.Name,
		Description: res.Description,
		State: dto.CityState{
			Name: res.StateName,
			Code: res.StateCode,
		},
		Country: dto.CityCountry{
			Name: res.CountryName,
			Code: res.CountryCode,
		},
		Image: dto.CityImage{
			Url:             res.ImageUrl,
			License:         utils.TextToStr(res.ImgLicense),
			LicenseLink:     utils.TextToStr(res.ImgLicenseLink),
			Attribution:     utils.TextToStr(res.ImgAttr),
			AttributionLink: utils.TextToStr(res.ImgAttrLink),
		},
		Coordinates: dto.CityCoordinates{
			Latitude:  res.Latitude,
			Longitude: res.Longitude,
		},
	}

	return &dto.GetCityByIdOutput{
		Body: city,
	}, nil
}

func (s *Service) create(body dto.CreateCityInputBody) (*dto.CreateCityOutput, error) {
	dbCity, err := s.app.Db.Queries.CreateCity(context.Background(), db.CreateCityParams{
		ID:             body.ID,
		Name:           body.Name,
		StateCode:      body.StateCode,
		StateName:      body.StateName,
		CountryCode:    body.CountryCode,
		CountryName:    body.CountryName,
		ImageUrl:       body.ImageUrl,
		Latitude:       body.Latitude,
		Longitude:      body.Longitude,
		Description:    body.Description,
		ImgLicense:     utils.StrToText(body.ImageLicense),
		ImgLicenseLink: utils.StrToText(body.ImageLicenseLink),
		ImgAttr:        utils.StrToText(body.ImageAttribution),
		ImgAttrLink:    utils.StrToText(body.ImageAttributionLink),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error400BadRequest("City already exists")
		}

		return nil, huma.Error500InternalServerError("Internal server error")
	}

	city := dto.CreateCityOutputBody{
		ID:          dbCity.ID,
		Name:        dbCity.Name,
		Description: dbCity.Description,
		State: dto.CityState{
			Name: dbCity.StateName,
			Code: dbCity.StateCode,
		},
		Country: dto.CityCountry{
			Name: dbCity.CountryName,
			Code: dbCity.CountryCode,
		},
		Image: dto.CityImage{
			Url:             dbCity.ImageUrl,
			License:         utils.TextToStr(dbCity.ImgLicense),
			LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
			Attribution:     utils.TextToStr(dbCity.ImgAttr),
			AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
		},
		Coordinates: dto.CityCoordinates{
			Latitude:  dbCity.Latitude,
			Longitude: dbCity.Longitude,
		},
	}

	return &dto.CreateCityOutput{
		Body: city,
	}, nil
}

func (s *Service) remove(id int32) error {
	err := s.app.Db.Queries.DeleteCity(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("City not found")
		}

		return huma.Error500InternalServerError("Internal server error")
	}

	return nil
}

func (s *Service) update(id int32, body dto.UpdateCityInputBody) (*dto.UpdateCityOutput, error) {
	dbCity, err := s.app.Db.Queries.UpdateCity(context.Background(), db.UpdateCityParams{
		ID:             id,
		Name:           body.Name,
		StateCode:      body.StateCode,
		StateName:      body.StateName,
		CountryCode:    body.CountryCode,
		CountryName:    body.CountryName,
		ImageUrl:       body.ImageUrl,
		Latitude:       body.Latitude,
		Longitude:      body.Longitude,
		Description:    body.Description,
		ImgLicense:     utils.StrToText(body.ImageLicense),
		ImgLicenseLink: utils.StrToText(body.ImageLicenseLink),
		ImgAttr:        utils.StrToText(body.ImageAttribution),
		ImgAttrLink:    utils.StrToText(body.ImageAttributionLink),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("City not found")
		}

		return nil, huma.Error500InternalServerError("Internal server error")
	}

	city := dto.UpdateCityOutputBody{
		ID:          dbCity.ID,
		Name:        dbCity.Name,
		Description: dbCity.Description,
		State: dto.CityState{
			Name: dbCity.StateName,
			Code: dbCity.StateCode,
		},
		Country: dto.CityCountry{
			Name: dbCity.CountryName,
			Code: dbCity.CountryCode,
		},
		Image: dto.CityImage{
			Url:             dbCity.ImageUrl,
			License:         utils.TextToStr(dbCity.ImgLicense),
			LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
			Attribution:     utils.TextToStr(dbCity.ImgAttr),
			AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
		},
	}

	return &dto.UpdateCityOutput{
		Body: city,
	}, nil
}
