package pois

import (
	"context"
	"encoding/json"
	"sync"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	App  *core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func NewService(app *core.Application) *Service {
	return &Service{
		App:  app,
		db:   app.Db.Queries,
		pool: app.Db.Pool,
	}
}

func (s *Service) FindMany(ctx context.Context, ids []string) ([]dto.Poi, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if len(ids) == 0 {
		return []dto.Poi{}, nil
	}

	dbPois, err := s.db.GetPoisByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get point of interests")
	}

	pois, err := mapper.ToPois(dbPois[0])

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get point of interests")
	}

	return pois, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Poi, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.FindMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if len(res) != 1 {
		err = huma.Error404NotFound("Point of interest not found")
		sp.RecordError(err)
		return nil, err
	}

	return &res[0], nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetPoiByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)
	isFavorite := false
	isBookmarked := false

	if userId != "" {
		var wg sync.WaitGroup

		wg.Add(2)

		go func() {
			defer wg.Done()
			isFavorite = s.isFavorite(ctx, id)
		}()

		go func() {
			defer wg.Done()
			isBookmarked = s.isBookmarked(ctx, id)
		}()

		wg.Wait()
	}

	return &dto.GetPoiByIdOutput{
		Body: dto.GetPoiByIdOutputBody{
			Poi: *res,
			Meta: dto.GetPoiByIdMeta{
				IsFavorite:   isFavorite,
				IsBookmarked: isBookmarked,
			},
		},
	}, nil
}

func (s *Service) isFavorite(ctx context.Context, poiId string) bool {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	_, err := s.App.Db.Queries.IsFavorite(ctx, db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) isBookmarked(ctx context.Context, poiId string) bool {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	_, err := s.App.Db.Queries.IsBookmarked(ctx, db.IsBookmarkedParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) peek(ctx context.Context) (*dto.PeekPoisOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := s.db.GetPaginatedPoiIds(ctx, db.GetPaginatedPoiIdsParams{
		Offset: 0,
		Limit:  25,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to peek pois")
	}

	res, err := s.FindMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.PeekPoisOutput{
		Body: dto.PeekPoisOutputBody{
			Pois: res,
		},
	}, nil
}

func (s *Service) updateAddress(ctx context.Context, id string, body dto.UpdatePoiAddressInputBody) (*dto.UpdatePoiAddressOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to update this address")
		sp.RecordError(err)
		return nil, err
	}

	poi, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
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

	err = s.db.UpdateAddress(ctx, db.UpdateAddressParams{
		ID:         poi.AddressID,
		CityID:     body.CityID,
		Line1:      body.Line1,
		Line2:      pgtype.Text{String: line2, Valid: body.Line2 != nil},
		PostalCode: pgtype.Text{String: postalCode, Valid: body.PostalCode != nil},
		Lat:        body.Lat,
		Lng:        body.Lng,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update address")
	}

	poi, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdatePoiAddressOutput{
		Body: dto.UpdatePoiAddressOutputBody{
			Poi: *poi,
		},
	}, nil
}

func (s *Service) updateInfo(ctx context.Context, id string, body dto.UpdatePoiInfoInputBody) (*dto.UpdatePoiInfoOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to update this info")
		sp.RecordError(err)
		return nil, err
	}

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
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

	err = s.db.UpdatePoiInfo(ctx, db.UpdatePoiInfoParams{
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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update info")
	}

	poi, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdatePoiInfoOutput{
		Body: dto.UpdatePoiInfoOutputBody{
			Poi: *poi,
		},
	}, nil
}

func (s *Service) updateAmenities(ctx context.Context, id string, body dto.UpdatePoiAmenitiesInputBody) (*dto.UpdatePoiAmenitiesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to update this amenities")
		sp.RecordError(err)
		return nil, err
	}

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	err = qtx.DeletePoiAllAmenities(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete all amenities")
	}

	for _, amenityId := range body.AmenityIds {
		_, err = qtx.CreateOneAmenitiesPois(ctx, db.CreateOneAmenitiesPoisParams{
			AmenityID: amenityId,
			PoiID:     id,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create amenity poi connection")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	poi, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdatePoiAmenitiesOutput{
		Body: dto.UpdatePoiAmenitiesOutputBody{
			Poi: *poi,
		},
	}, nil
}

func (s *Service) updateHours(ctx context.Context, id string, body dto.UpdatePoiHoursInputBody) (*dto.UpdatePoiHoursOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to update this hours")
		sp.RecordError(err)
		return nil, err
	}

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	asMap := make(map[string]dto.OpenClose)

	for _, entry := range body.Hours {
		asMap[entry.Day] = dto.OpenClose{
			OpensAt:  entry.OpensAt,
			ClosesAt: entry.ClosesAt,
		}
	}

	serialized, err := json.Marshal(asMap)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to marshal hours")
	}

	err = s.db.UpdatePoiHours(ctx, db.UpdatePoiHoursParams{
		ID:    id,
		Hours: serialized,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update hours")
	}

	poi, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdatePoiHoursOutput{
		Body: dto.UpdatePoiHoursOutputBody{
			Poi: *poi,
		},
	}, nil
}
