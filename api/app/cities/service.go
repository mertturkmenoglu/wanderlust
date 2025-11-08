package cities

import (
	"context"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"
)

type Service struct {
	repo *Repository
}

func (s *Service) list(ctx context.Context) (*ListCitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx)

	if err != nil {
		return nil, err
	}

	cities := make([]dto.City, len(res))

	for i, c := range res {
		cities[i] = dto.ToCity(c)
	}

	return &ListCitiesOutput{
		Body: ListCitiesOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) featured(ctx context.Context) (*ListFeaturedCitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.listFeatured(ctx)

	if err != nil {
		return nil, err
	}

	cities := make([]dto.City, len(res))

	for i, c := range res {
		cities[i] = dto.ToCity(c)
	}

	return &ListFeaturedCitiesOutput{
		Body: ListFeaturedCitiesOutputBody{
			Cities: cities,
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id int32) (*GetCityByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &GetCityByIdOutput{
		Body: GetCityByIdOutputBody{
			City: dto.ToCity(*res),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateCityInputBody) (*CreateCityOutput, error) {
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
		Lat:         body.Lat,
		Lng:         body.Lng,
		Description: body.Description,
	})

	if err != nil {
		return nil, err
	}

	return &CreateCityOutput{
		Body: CreateCityOutputBody{
			City: dto.ToCity(*res),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id int32) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}

func (s *Service) update(ctx context.Context, id int32, body UpdateCityInputBody) (*UpdateCityOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.repo.update(ctx, UpdateParams{
		ID:          id,
		Name:        body.Name,
		StateCode:   body.StateCode,
		StateName:   body.StateName,
		CountryCode: body.CountryCode,
		CountryName: body.CountryName,
		Image:       body.Image,
		Lat:         body.Lat,
		Lng:         body.Lng,
		Description: body.Description,
	})

	if err != nil {
		return nil, err
	}

	res, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdateCityOutput{
		Body: UpdateCityOutputBody{
			City: dto.ToCity(*res),
		},
	}, nil
}
