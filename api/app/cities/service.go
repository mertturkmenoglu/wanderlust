package cities

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context) (*dto.CitiesListOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	cities := make([]dto.City, len(res))

	for i, c := range res {
		cities[i] = mapper.ToCity(c)
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

	res, err := s.repo.listFeatured(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	cities := make([]dto.City, len(res))

	for i, c := range res {
		cities[i] = mapper.ToCity(c)
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

	res, err := s.repo.get(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetCityByIdOutput{
		Body: dto.GetCityByIdOutputBody{
			City: mapper.ToCity(*res),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateCityInputBody) (*dto.CreateCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.create(ctx, CreateParams{
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
		return nil, err
	}

	return &dto.CreateCityOutput{
		Body: dto.CreateCityOutputBody{
			City: mapper.ToCity(*res),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}

func (s *Service) update(ctx context.Context, id int32, body dto.UpdateCityInputBody) (*dto.UpdateCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.update(ctx, UpdateParams{
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
		return nil, err
	}

	return &dto.UpdateCityOutput{
		Body: dto.UpdateCityOutputBody{
			City: mapper.ToCity(*res),
		},
	}, nil
}
