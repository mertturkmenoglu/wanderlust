package cities

import (
	"context"
	"errors"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) list(ctx context.Context) (*dto.CitiesListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbCities, err := s.db.GetCities(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("No cities found")
		}

		return nil, huma.Error500InternalServerError("Failed to get all cities")
	}

	cities := make([]dto.City, len(dbCities))

	for i, dbCity := range dbCities {
		cities[i] = mapper.ToCity(dbCity)
	}

	return &dto.CitiesListOutput{
		Body: dto.CitiesListOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) featured(ctx context.Context) (*dto.CitiesFeaturedOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

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

	dbFeaturedCities, err := s.db.GetFeaturedCities(ctx, featuredCitiesIds)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("No featured cities found")
		}

		return nil, huma.Error500InternalServerError("Failed to get featured cities")
	}

	cities := make([]dto.City, len(dbFeaturedCities))

	for i, dbCity := range dbFeaturedCities {
		cities[i] = mapper.ToCity(dbCity)
	}

	return &dto.CitiesFeaturedOutput{
		Body: dto.CitiesFeaturedOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id int32) (*dto.GetCityByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetCityById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("City not found")
		}

		return nil, huma.Error500InternalServerError("Failed to get city")
	}

	return &dto.GetCityByIdOutput{
		Body: dto.GetCityByIdOutputBody{
			City: mapper.ToCity(res),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateCityInputBody) (*dto.CreateCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbCity, err := s.db.CreateCity(ctx, db.CreateCityParams{
		ID:          body.ID,
		Name:        body.Name,
		StateCode:   body.StateCode,
		StateName:   body.StateName,
		CountryCode: body.CountryCode,
		CountryName: body.CountryName,
		Image:       body.Image,
		Latitude:    body.Latitude,
		Longitude:   body.Longitude,
		Description: body.Description,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrTooManyRows) {
			return nil, huma.Error400BadRequest("City already exists")
		}

		return nil, huma.Error500InternalServerError("Failed to create city")
	}

	return &dto.CreateCityOutput{
		Body: dto.CreateCityOutputBody{
			City: mapper.ToCity(dbCity),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.db.DeleteCity(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return huma.Error404NotFound("City not found")
		}

		return huma.Error500InternalServerError("Failed to delete city")
	}

	return nil
}

func (s *Service) update(ctx context.Context, id int32, body dto.UpdateCityInputBody) (*dto.UpdateCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbCity, err := s.db.UpdateCity(ctx, db.UpdateCityParams{
		ID:          id,
		Name:        body.Name,
		StateCode:   body.StateCode,
		StateName:   body.StateName,
		CountryCode: body.CountryCode,
		CountryName: body.CountryName,
		Image:       body.Image,
		Latitude:    body.Latitude,
		Longitude:   body.Longitude,
		Description: body.Description,
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("City not found")
		}

		return nil, huma.Error500InternalServerError("Failed to update city")
	}

	return &dto.UpdateCityOutput{
		Body: dto.UpdateCityOutputBody{
			City: mapper.ToCity(dbCity),
		},
	}, nil
}
