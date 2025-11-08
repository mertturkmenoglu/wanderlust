package places

import (
	"context"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/di"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"
)

type Service struct {
	cache *cache.Cache
	repo  *Repository
}

func NewService(app *core.Application) *Service {
	dbSvc := app.Get(di.SVC_DB).(*db.Db)
	cacheSvc := app.Get(di.SVC_CACHE).(*cache.Cache)

	return &Service{
		cache: cacheSvc,
		repo: &Repository{
			db:   dbSvc.Queries,
			pool: dbSvc.Pool,
		},
	}
}

func (s *Service) FindMany(ctx context.Context, ids []string) ([]dto.Place, error) {
	return s.repo.list(ctx, ids)
}

func (s *Service) find(ctx context.Context, id string) (*dto.Place, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx, []string{id})

	if err != nil {
		return nil, err
	}

	if len(res) != 1 {
		return nil, ErrNotFound
	}

	return &res[0], nil
}

func (s *Service) get(ctx context.Context, id string) (*GetPlaceByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)
	isFavorite := false
	isBookmarked := false

	if userId != "" {
		g, gctx := errgroup.WithContext(ctx)

		g.Go(func() error {
			var err error
			isFavorite, err = s.repo.isFavorite(gctx, userId, id)
			return err
		})

		g.Go(func() error {
			var err error
			isBookmarked, err = s.repo.isBookmarked(gctx, userId, id)
			return err
		})

		if err := g.Wait(); err != nil {
			return nil, errors.Wrap(ErrFailedToGet, err.Error())
		}
	}

	return &GetPlaceByIdOutput{
		Body: GetPlaceByIdOutputBody{
			Place: *res,
			Meta: GetPlaceByIdMeta{
				IsFavorite:   isFavorite,
				IsBookmarked: isBookmarked,
			},
		},
	}, nil
}

func (s *Service) peek(ctx context.Context) (*PeekPlacesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.peek(ctx)

	if err != nil {
		return nil, err
	}

	return &PeekPlacesOutput{
		Body: PeekPlacesOutputBody{
			Places: res,
		},
	}, nil
}

func (s *Service) updateAddress(ctx context.Context, id string, body UpdatePlaceAddressInputBody) (*UpdatePlaceAddressOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		return nil, ErrNotAuthorizedToUpdateAddress
	}

	place, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	var line2 string
	var postalCode string

	if body.Line2 != nil {
		line2 = *body.Line2
	}

	if body.PostalCode != nil {
		postalCode = *body.PostalCode
	}

	err = s.repo.updateAddress(ctx, UpdateAddressParams{
		ID:         place.AddressID,
		CityID:     body.CityID,
		Line1:      body.Line1,
		Line2:      pgtype.Text{String: line2, Valid: body.Line2 != nil},
		PostalCode: pgtype.Text{String: postalCode, Valid: body.PostalCode != nil},
		Lat:        body.Lat,
		Lng:        body.Lng,
	})

	if err != nil {
		return nil, err
	}

	place, err = s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdatePlaceAddressOutput{
		Body: UpdatePlaceAddressOutputBody{
			Place: *place,
		},
	}, nil
}

func (s *Service) updateInfo(ctx context.Context, id string, body UpdatePlaceInfoInputBody) (*UpdatePlaceInfoOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		return nil, ErrNotAuthorizedToUpdateInfo
	}

	// Check if place exists
	_, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	var phone string
	var website string

	if body.Phone != nil {
		phone = *body.Phone
	}

	if body.Website != nil {
		website = *body.Website
	}

	err = s.repo.updateInfo(ctx, UpdateInfoParams{
		ID:                 id,
		Name:               body.Name,
		CategoryID:         body.CategoryID,
		Description:        body.Description,
		Phone:              pgtype.Text{String: phone, Valid: body.Phone != nil},
		Website:            pgtype.Text{String: website, Valid: body.Website != nil},
		AccessibilityLevel: body.AccessibilityLevel,
		PriceLevel:         body.PriceLevel,
	})

	if err != nil {
		return nil, err
	}

	place, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdatePlaceInfoOutput{
		Body: UpdatePlaceInfoOutputBody{
			Place: *place,
		},
	}, nil
}

func (s *Service) updateAmenities(ctx context.Context, id string, body UpdatePlaceAmenitiesInputBody) (*UpdatePlaceAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		return nil, ErrNotAuthorizedToUpdateAmenities
	}

	// Check if the place exists
	_, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	err = s.repo.updateAmenities(ctx, id, body.Amenities)

	if err != nil {
		return nil, err
	}

	place, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdatePlaceAmenitiesOutput{
		Body: UpdatePlaceAmenitiesOutputBody{
			Place: *place,
		},
	}, nil
}

func (s *Service) updateHours(ctx context.Context, id string, body UpdatePlaceHoursInputBody) (*UpdatePlaceHoursOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		return nil, ErrNotAuthorizedToUpdateHours
	}

	// Check if the place exists
	_, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	err = s.repo.updateHours(ctx, id, body.Hours)

	if err != nil {
		return nil, err
	}

	place, err := s.find(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdatePlaceHoursOutput{
		Body: UpdatePlaceHoursOutputBody{
			Place: *place,
		},
	}, nil
}
