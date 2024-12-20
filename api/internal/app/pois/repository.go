package pois

import (
	"context"
	"encoding/json"
	"errors"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5"
)

func (r *Repository) peekPois() ([]db.Poi, error) {
	return r.DI.Db.Queries.PeekPois(context.Background())
}

func (r *Repository) GetPoiById(id string) (GetPoiByIdDao, error) {
	poi, err := r.DI.Db.Queries.GetPoiById(context.Background(), id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return GetPoiByIdDao{}, ErrNotFound
		}

		return GetPoiByIdDao{}, err
	}

	media, err := r.DI.Db.Queries.GetPoiMedia(context.Background(), id)

	if err != nil {
		return GetPoiByIdDao{}, err
	}

	amenities, err := r.DI.Db.Queries.GetPoiAmenities(context.Background(), id)

	if err != nil {
		return GetPoiByIdDao{}, err
	}

	return GetPoiByIdDao{
		Poi:       poi.Poi,
		Address:   poi.Address,
		City:      poi.City,
		Category:  poi.Category,
		Media:     media,
		Amenities: amenities,
	}, nil
}

func (r *Repository) isFavorite(poiId string, userId string) bool {
	_, err := r.DI.Db.Queries.IsFavorite(context.Background(), db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (r *Repository) isBookmarked(poiId string, userId string) bool {
	_, err := r.DI.Db.Queries.IsBookmarked(context.Background(), db.IsBookmarkedParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (r *Repository) publishDraft(draft map[string]any) error {
	ctx := context.Background()
	tx, err := r.DI.Db.Pool.Begin(ctx)

	if err != nil {
		return err
	}

	defer tx.Rollback(ctx)

	qtx := r.DI.Db.Queries.WithTx(tx)

	address := draft["address"].(map[string]any)
	cityId, ok := address["cityId"].(float64)

	if !ok {
		return errors.New("cityId is not valid")
	}

	addr, err := qtx.CreateAddress(ctx, db.CreateAddressParams{
		CityID:     (int32)(cityId),
		Line1:      address["line1"].(string),
		Line2:      utils.StrToText(address["line2"].(string)),
		PostalCode: utils.StrToText(address["postalCode"].(string)),
		Lat:        address["lat"].(float64),
		Lng:        address["lng"].(float64),
	})

	if err != nil {
		return err
	}

	hoursbytes, err := json.Marshal(draft["hours"])

	if err != nil {
		return err
	}

	poi, err := qtx.CreateOnePoi(ctx, db.CreateOnePoiParams{
		ID:                 utils.GenerateId(r.DI.Flake),
		Name:               draft["name"].(string),
		Phone:              utils.StrToText(draft["phone"].(string)),
		Description:        draft["description"].(string),
		AddressID:          addr.ID,
		Website:            utils.StrToText(draft["website"].(string)),
		PriceLevel:         (int16)(draft["priceLevel"].(float64)),
		AccessibilityLevel: (int16)(draft["accessibilityLevel"].(float64)),
		TotalVotes:         0,
		TotalPoints:        0,
		TotalFavorites:     0,
		CategoryID:         (int16)(draft["categoryId"].(float64)),
		OpenTimes:          hoursbytes,
	})

	if err != nil {
		return err
	}

	_, has := draft["amenities"]

	if has {
		amenitiesIds := draft["amenities"].([]interface{})

		for _, amenityId := range amenitiesIds {
			_, err = qtx.CreateOneAmenitiesPois(ctx, db.CreateOneAmenitiesPoisParams{
				AmenityID: int32(amenityId.(float64)),
				PoiID:     poi.ID,
			})

			if err != nil {
				return err
			}
		}
	}

	for _, media := range draft["media"].([]interface{}) {
		mediaMap := media.(map[string]any)
		_, err = qtx.CreatePoiMedia(ctx, db.CreatePoiMediaParams{
			PoiID:      poi.ID,
			Url:        mediaMap["url"].(string),
			Alt:        mediaMap["alt"].(string),
			Caption:    utils.StrToText(mediaMap["caption"].(string)),
			MediaOrder: int16(mediaMap["order"].(float64)),
		})

		if err != nil {
			return err
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return err
	}

	return nil
}
