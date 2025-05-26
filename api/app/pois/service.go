package pois

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"sync"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	App  *core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) FindMany(ctx context.Context, ids []string) ([]dto.Poi, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbPois, err := s.db.GetPoisByIdsPopulated(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get point of interests")
	}

	pois := make([]dto.Poi, len(dbPois))

	for i, dbPoi := range dbPois {
		var amenities []dto.Amenity = []dto.Amenity{}

		if len(dbPoi.Amenities) != 0 {
			err = json.Unmarshal(dbPoi.Amenities, &amenities)

			if err != nil {
				sp.RecordError(err)
				return nil, huma.Error500InternalServerError("Failed to unmarshal amenities")
			}
		}

		var dbMedia []db.Medium = []db.Medium{}

		if len(dbPoi.Media) != 0 {
			err = json.Unmarshal(dbPoi.Media, &dbMedia)

			if err != nil {
				sp.RecordError(err)
				return nil, huma.Error500InternalServerError("Failed to unmarshal media")
			}
		}

		media := mapper.ToMedia(dbMedia)
		openHours, err := mapper.ToOpenHours(dbPoi.Poi.OpenTimes)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to unmarshal open times")
		}

		pois[i] = mapper.ToPoi(dbPoi.Poi, dbPoi.Category, dbPoi.Address, dbPoi.City, amenities, openHours, media)
	}

	return pois, nil
}

func (s *Service) getPoiById(ctx context.Context, id string) (*dto.GetPoiByIdOutput, error) {
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
			Poi: res[0],
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

func (s *Service) peekPois(ctx context.Context) (*dto.PeekPoisOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := s.db.PeekPois(ctx)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Pois not found")
		}

		return nil, huma.Error500InternalServerError("Failed to peek pois")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
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

func (s *Service) createDraft(ctx context.Context) (*dto.CreatePoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	id := s.App.ID.Flake()

	draft := map[string]any{
		"id": id,
		"v":  2,
	}

	v, err := json.Marshal(draft)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create draft")
	}

	err = s.App.Cache.Set(ctx, "poi-draft:"+id, string(v), time.Hour*24*90).Err() // 90 days

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to set draft")
	}

	_, err = s.App.Cache.Client.LPush(ctx, "poi-drafts", id).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to record draft")
	}

	return &dto.CreatePoiDraftOutput{
		Body: dto.CreatePoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}

func (s *Service) getDrafts(ctx context.Context) (*dto.GetAllPoiDraftsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	ids, err := s.App.Cache.Client.LRange(ctx, "poi-drafts", 0, -1).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get drafts")
	}

	var drafts []map[string]any

	for _, id := range ids {
		v, err := s.App.Cache.Get(ctx, "poi-draft:"+id).Result()

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("failed to get draft")
		}

		var draft map[string]any

		err = json.Unmarshal([]byte(v), &draft)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("failed to unmarshal draft")
		}

		drafts = append(drafts, draft)
	}

	return &dto.GetAllPoiDraftsOutput{
		Body: dto.GetAllPoiDraftsOutputBody{
			Drafts: drafts,
		},
	}, nil
}

func (s *Service) getDraft(ctx context.Context, id string) (*dto.GetPoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	v, err := s.App.Cache.Get(ctx, "poi-draft:"+id).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Draft not found")
	}

	var draft map[string]any

	err = json.Unmarshal([]byte(v), &draft)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to unmarshal draft")
	}

	return &dto.GetPoiDraftOutput{
		Body: dto.GetPoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}

func (s *Service) updateDraft(ctx context.Context, id string, body dto.UpdatePoiDraftInputBody) (*dto.UpdatePoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	v, err := json.Marshal(body.Values)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to marshal draft")
	}

	err = s.App.Cache.Set(ctx, "poi-draft:"+id, string(v), 0).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to set draft")
	}

	return &dto.UpdatePoiDraftOutput{
		Body: dto.UpdatePoiDraftOutputBody{
			Draft: body.Values,
		},
	}, nil
}

func (s *Service) uploadMedia(ctx context.Context, id string, input dto.UploadPoiMediaInputBody) (*dto.UpdatePoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	bucket := upload.BUCKET_POIS

	ok := s.App.Upload.FileExists(bucket, input.FileName)

	if !ok {
		err := huma.Error400BadRequest("File not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.App.Cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)) {
		err := huma.Error400BadRequest("Incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// delete cached information
	err := s.App.Cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.ID)).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	url := s.App.Upload.GetUrlForFile(bucket, input.FileName)

	draft, err := s.getDraft(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Draft not found")
	}

	media, has := draft.Body.Draft["media"]

	if !has {
		media = make([]any, 0)
	}

	parts := strings.Split(input.FileName, ".")
	extension := parts[len(parts)-1]

	draft.Body.Draft["media"] = append(media.([]any), map[string]any{
		"type":      "image",
		"url":       url,
		"fileName":  input.FileName,
		"alt":       input.Alt,
		"caption":   input.Caption,
		"extension": extension,
	})

	res, err := s.updateDraft(ctx, id, dto.UpdatePoiDraftInputBody{
		Values: draft.Body.Draft,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update draft")
	}

	return res, nil
}

func (s *Service) deleteMedia(ctx context.Context, id string, index int32) (*dto.UpdatePoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	draft, err := s.getDraft(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Draft not found")
	}

	media, has := draft.Body.Draft["media"]

	if !has {
		err := huma.Error404NotFound("Media not found")
		sp.RecordError(err)
		return nil, err
	}

	mediaCast, ok := media.([]any)

	if !ok {
		err := huma.Error500InternalServerError("Failed to cast media")
		sp.RecordError(err)
		return nil, err
	}

	m := mediaCast[int(index)]

	img, ok := m.(map[string]any)

	if !ok {
		err := huma.Error500InternalServerError("Failed to cast img")
		sp.RecordError(err)
		return nil, err
	}

	err = s.App.Upload.RemoveFileFromUrl(img["url"].(string), upload.BUCKET_POIS)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete image")
	}

	newMedia := make([]any, 0)

	for i, m := range mediaCast {
		if i != int(index) {
			newMedia = append(newMedia, m)
		}
	}

	draft.Body.Draft["media"] = newMedia

	res, err := s.updateDraft(ctx, id, dto.UpdatePoiDraftInputBody{
		Values: draft.Body.Draft,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update draft")
	}

	return res, nil
}

func (s *Service) deleteDraft(ctx context.Context, id string, deleteMedia bool) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	draft, err := s.getDraft(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error404NotFound("Draft not found")
	}

	media, has := draft.Body.Draft["media"]

	if has && deleteMedia {
		mediaCast, ok := media.([]any)

		if !ok {
			err := huma.Error500InternalServerError("Failed to cast media")
			sp.RecordError(err)
			return err
		}

		for _, m := range mediaCast {
			img, ok := m.(map[string]any)

			if !ok {
				err := huma.Error500InternalServerError("Failed to cast img")
				sp.RecordError(err)
				return err
			}

			err = s.App.Upload.RemoveFileFromUrl(img["url"].(string), upload.BUCKET_POIS)

			if err != nil {
				sp.RecordError(err)
				return huma.Error500InternalServerError("Failed to delete image")
			}
		}

	}

	err = s.App.Cache.Del(ctx, "poi-draft:"+id).Err()

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete draft")
	}

	_, err = s.App.Cache.Client.LRem(ctx, "poi-drafts", 1, id).Result()

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete draft from list")
	}

	return nil
}

func (s *Service) publishDraft(ctx context.Context, id string) (*dto.PublishPoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	draft, err := s.getDraft(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error404NotFound("Draft not found")
	}

	res, err := s.saveDraftToDatabase(ctx, draft.Body.Draft)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to publish draft")
	}

	err = s.deleteDraft(ctx, id, false)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete draft")
	}

	return res, nil
}

func (s *Service) saveDraftToDatabase(ctx context.Context, draft map[string]any) (*dto.PublishPoiDraftOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	address, ok := draft["address"].(map[string]any)

	if !ok {
		err := huma.Error500InternalServerError("Failed to cast address")
		sp.RecordError(err)
		return nil, err
	}

	cityId, ok := address["cityId"].(float64)

	if !ok {
		err := huma.Error500InternalServerError("Failed to cast cityId")
		sp.RecordError(err)
		return nil, err
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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create address")
	}

	hoursbytes, err := json.Marshal(draft["hours"])

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to marshal hours")
	}

	poi, err := qtx.CreateOnePoi(ctx, db.CreateOnePoiParams{
		ID:                 s.App.ID.Flake(),
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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create poi")
	}

	_, has := draft["amenities"]

	if has {
		amenitiesIds := draft["amenities"].([]any)

		for _, amenityId := range amenitiesIds {
			_, err = qtx.CreateOneAmenitiesPois(ctx, db.CreateOneAmenitiesPoisParams{
				AmenityID: int32(amenityId.(float64)),
				PoiID:     poi.ID,
			})

			if err != nil {
				sp.RecordError(err)
				return nil, huma.Error500InternalServerError("Failed to create amenity poi connection")
			}
		}
	}

	for i, media := range draft["media"].([]any) {
		mediaMap := media.(map[string]any)

		maybeAlt, ok := mediaMap["url"].(string)

		if !ok {
			maybeAlt = ""
		}

		maybeCaption, ok := mediaMap["caption"].(string)

		if !ok {
			maybeCaption = ""
		}

		_, err = qtx.CreatePoiMedia(ctx, db.CreatePoiMediaParams{
			PoiID:      poi.ID,
			Url:        mediaMap["url"].(string),
			Alt:        maybeAlt,
			Caption:    utils.StrToText(maybeCaption),
			MediaOrder: int16(i),
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create media")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	return &dto.PublishPoiDraftOutput{
		Body: dto.PublishPoiDraftOutputBody{
			ID: poi.ID,
		},
	}, nil
}
