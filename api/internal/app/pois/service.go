package pois

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/upload"
	"wanderlust/internal/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
)

type Service struct {
	App *core.Application
}

func (s *Service) GetPoisByIds(ids []string) ([]dto.Poi, error) {
	dbPois, err := s.App.Db.Queries.GetPoisByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get point of interests")
	}

	pois := make([]dto.Poi, len(dbPois))

	for i, dbPoi := range dbPois {
		var dbAmenities []db.GetPoiAmenitiesRow = []db.GetPoiAmenitiesRow{}

		if len(dbPoi.Amenities) != 0 {
			err = json.Unmarshal(dbPoi.Amenities, &dbAmenities)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal amenities")
			}
		}

		amenities := mapper.FromGetPoiAmenitiesRowToAmenities(dbAmenities)

		var dbMedia []db.Medium = []db.Medium{}

		if len(dbPoi.Media) != 0 {
			err = json.Unmarshal(dbPoi.Media, &dbMedia)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal media")
			}
		}

		media := mapper.ToMedia(dbMedia)
		openHours, err := mapper.ToOpenHours(dbPoi.Poi.OpenTimes)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal open times")
		}

		pois[i] = mapper.ToPoi(dbPoi.Poi, dbPoi.Category, dbPoi.Address, dbPoi.City, amenities, openHours, media)
	}

	return pois, nil
}

func (s *Service) getPoiById(id string) (*dto.Poi, error) {
	res, err := s.GetPoisByIds([]string{id})

	if err != nil {
		return nil, err
	}

	if len(res) != 1 {
		return nil, huma.Error404NotFound("point of interest not found")
	}

	return &res[0], nil
}

func (s *Service) isFavorite(poiId string, userId string) bool {
	_, err := s.App.Db.Queries.IsFavorite(context.Background(), db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) isBookmarked(poiId string, userId string) bool {
	_, err := s.App.Db.Queries.IsBookmarked(context.Background(), db.IsBookmarkedParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil
}

func (s *Service) peekPois() (*dto.PeekPoisOutput, error) {
	dbRes, err := s.App.Db.Queries.PeekPois(context.Background())

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("pois not found")
		}

		return nil, huma.Error500InternalServerError("failed to peek pois")
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	res, err := s.GetPoisByIds(ids)

	if err != nil {
		return nil, err
	}

	return &dto.PeekPoisOutput{
		Body: dto.PeekPoisOutputBody{
			Pois: res,
		},
	}, nil
}

func (s *Service) createDraft() (*dto.CreatePoiDraftOutput, error) {
	id := utils.GenerateId(s.App.Flake)
	draft := map[string]any{
		"id": id,
		"v":  2,
	}

	v, err := json.Marshal(draft)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create draft")
	}

	err = s.App.Cache.Set("poi-draft:"+id, string(v), time.Hour*24*90) // 90 days

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to set draft")
	}

	_, err = s.App.Cache.Client.LPush(context.Background(), "poi-drafts", id).Result()

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to record draft")
	}

	return &dto.CreatePoiDraftOutput{
		Body: dto.CreatePoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}

func (s *Service) getDrafts() (*dto.GetAllPoiDraftsOutput, error) {
	ids, err := s.App.Cache.Client.LRange(context.Background(), "poi-drafts", 0, -1).Result()

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get drafts")
	}

	var drafts []map[string]any

	for _, id := range ids {
		v, err := s.App.Cache.Get("poi-draft:" + id)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to get draft")
		}

		var draft map[string]any

		err = json.Unmarshal([]byte(v), &draft)

		if err != nil {
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

func (s *Service) getDraft(id string) (*dto.GetPoiDraftOutput, error) {
	v, err := s.App.Cache.Get("poi-draft:" + id)

	if err != nil {
		return nil, huma.Error404NotFound("draft not found")
	}

	var draft map[string]any

	err = json.Unmarshal([]byte(v), &draft)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to unmarshal draft")
	}

	return &dto.GetPoiDraftOutput{
		Body: dto.GetPoiDraftOutputBody{
			Draft: draft,
		},
	}, nil
}

func (s *Service) updateDraft(id string, body dto.UpdatePoiDraftInputBody) (*dto.UpdatePoiDraftOutput, error) {
	v, err := json.Marshal(body.Values)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to marshal draft")
	}

	err = s.App.Cache.Set("poi-draft:"+id, string(v), 0)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to set draft")
	}

	return &dto.UpdatePoiDraftOutput{
		Body: dto.UpdatePoiDraftOutputBody{
			Draft: body.Values,
		},
	}, nil
}

func (s *Service) uploadMedia(userId string, id string, input dto.UploadPoiMediaInputBody) (*dto.UpdatePoiDraftOutput, error) {
	bucket := upload.BUCKET_POIS

	// Check if the file is uploaded
	_, err := s.App.Upload.Client.GetObject(
		context.Background(),
		string(bucket),
		input.FileName,
		minio.GetObjectOptions{},
	)

	if err != nil {
		return nil, huma.Error400BadRequest("file not uploaded")
	}

	// Check if user uploaded the correct file using cached information
	if !s.App.Cache.Has(cache.KeyBuilder(cache.KeyImageUpload, userId, input.ID)) {
		return nil, huma.Error400BadRequest("incorrect file")
	}

	// delete cached information
	err = s.App.Cache.Del(cache.KeyBuilder(cache.KeyImageUpload, id, input.ID))

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to delete cached information")
	}

	endpoint := s.App.Upload.Client.EndpointURL().String()
	url := endpoint + "/" + string(bucket) + "/" + input.FileName

	draft, err := s.getDraft(id)

	if err != nil {
		return nil, huma.Error404NotFound("draft not found")
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

	res, err := s.updateDraft(id, dto.UpdatePoiDraftInputBody{
		Values: draft.Body.Draft,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to update draft")
	}

	return res, nil
}

func (s *Service) deleteMedia(id string, index int32) (*dto.UpdatePoiDraftOutput, error) {
	draft, err := s.getDraft(id)

	if err != nil {
		return nil, huma.Error404NotFound("draft not found")
	}

	media, has := draft.Body.Draft["media"]

	if !has {
		return nil, huma.Error404NotFound("media not found")
	}

	mediaCast, ok := media.([]any)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast media")
	}

	m := mediaCast[int(index)]

	img, ok := m.(map[string]any)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast img")
	}

	err = s.App.Upload.Client.RemoveObject(
		context.Background(),
		string(upload.BUCKET_POIS),
		img["fileName"].(string),
		minio.RemoveObjectOptions{},
	)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to delete image")
	}

	newMedia := make([]any, 0)

	for i, m := range mediaCast {
		if i != int(index) {
			newMedia = append(newMedia, m)
		}
	}

	draft.Body.Draft["media"] = newMedia

	res, err := s.updateDraft(id, dto.UpdatePoiDraftInputBody{
		Values: draft.Body.Draft,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to update draft")
	}

	return res, nil
}

func (s *Service) deleteDraft(id string, deleteMedia bool) error {
	draft, err := s.getDraft(id)

	if err != nil {
		return huma.Error404NotFound("draft not found")
	}

	media, has := draft.Body.Draft["media"]

	if has && deleteMedia {
		mediaCast, ok := media.([]any)

		if !ok {
			return huma.Error500InternalServerError("failed to cast media")
		}

		for _, m := range mediaCast {
			img, ok := m.(map[string]any)

			if !ok {
				return huma.Error500InternalServerError("failed to cast img")
			}

			err = s.App.Upload.Client.RemoveObject(
				context.Background(),
				string(upload.BUCKET_POIS),
				img["fileName"].(string),
				minio.RemoveObjectOptions{},
			)

			if err != nil {
				return huma.Error500InternalServerError("failed to delete image")
			}
		}

	}

	err = s.App.Cache.Del("poi-draft:" + id)

	if err != nil {
		return huma.Error500InternalServerError("failed to delete draft")
	}

	_, err = s.App.Cache.Client.LRem(context.Background(), "poi-drafts", 1, id).Result()

	if err != nil {
		return huma.Error500InternalServerError("failed to delete draft from list")
	}

	return nil
}

func (s *Service) publishDraft(id string) (*dto.PublishPoiDraftOutput, error) {
	draft, err := s.getDraft(id)

	if err != nil {
		return nil, huma.Error404NotFound("draft not found")
	}

	res, err := s.saveDraftToDatabase(draft.Body.Draft)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to publish draft")
	}

	err = s.deleteDraft(id, false)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to delete draft")
	}

	return res, nil
}

func (s *Service) saveDraftToDatabase(draft map[string]any) (*dto.PublishPoiDraftOutput, error) {
	ctx := context.Background()
	tx, err := s.App.Db.Pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.App.Db.Queries.WithTx(tx)

	address, ok := draft["address"].(map[string]any)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast address")
	}

	cityId, ok := address["cityId"].(float64)

	if !ok {
		return nil, huma.Error500InternalServerError("failed to cast cityId")
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
		return nil, huma.Error500InternalServerError("failed to create address")
	}

	hoursbytes, err := json.Marshal(draft["hours"])

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to marshal hours")
	}

	poi, err := qtx.CreateOnePoi(ctx, db.CreateOnePoiParams{
		ID:                 utils.GenerateId(s.App.Flake),
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
		return nil, huma.Error500InternalServerError("failed to create poi")
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
				return nil, huma.Error500InternalServerError("failed to create amenity poi connection")
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
			return nil, huma.Error500InternalServerError("failed to create media")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to commit transaction")
	}

	return &dto.PublishPoiDraftOutput{
		Body: dto.PublishPoiDraftOutputBody{
			ID: poi.ID,
		},
	}, nil
}
