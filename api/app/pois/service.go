package pois

import (
	"context"
	"encoding/json"
	"log/slog"
	"sync"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

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

	isFav, err := s.App.Db.Queries.IsFavorite(ctx, db.IsFavoriteParams{
		PoiID:  poiId,
		UserID: userId,
	})

	return err == nil && isFav
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

func (s *Service) uploadImage(ctx context.Context, input *dto.UploadPoiImageInput) (*dto.UploadPoiImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	poi, err := s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to upload this image")
		sp.RecordError(err)
		return nil, err
	}

	bucket := upload.BUCKET_POIS

	// Check if the file is uploaded
	if !s.App.Upload.FileExists(bucket, input.Body.FileName) {
		err = huma.Error400BadRequest("File not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.App.Cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.Body.ID)) {
		err = huma.Error400BadRequest("Incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// delete cached information
	err = s.App.Cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, input.Body.ID)).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	var lastIndex int16 = 0

	for _, image := range poi.Images {
		if image.Index > lastIndex {
			lastIndex = image.Index
		}
	}

	newIndex := lastIndex + 1

	url := s.App.Upload.GetUrlForFile(bucket, input.Body.FileName)

	_, err = s.db.CreatePoiImage(ctx, db.CreatePoiImageParams{
		PoiID: poi.ID,
		Url:   url,
		Alt:   input.Body.Alt,
		Index: newIndex,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create poi image")
	}

	poi, err = s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UploadPoiImageOutput{
		Body: dto.UploadPoiImageOutputBody{
			Poi: *poi,
		},
	}, nil
}

func (s *Service) updateImage(ctx context.Context, input *dto.UpdatePoiImageInput) (*dto.UpdatePoiImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	poi, err := s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to update this image")
		sp.RecordError(err)
		return nil, err
	}

	var imgId *int64 = nil

	for _, image := range poi.Images {
		if image.ID == input.ImageID {
			imgId = &image.ID
			break
		}
	}

	if imgId == nil {
		err = huma.Error404NotFound("Image not found")
		sp.RecordError(err)
		return nil, err
	}

	_, err = s.db.UpdatePoiImageAlt(ctx, db.UpdatePoiImageAltParams{
		ID:    *imgId,
		PoiID: poi.ID,
		Alt:   input.Body.Alt,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update image")
	}

	poi, err = s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdatePoiImageOutput{
		Body: dto.UpdatePoiImageOutputBody{
			Poi: *poi,
		},
	}, nil
}

func (s *Service) deleteImage(ctx context.Context, input *dto.DeletePoiMediaInput) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	poi, err := s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to delete this image")
		sp.RecordError(err)
		return err
	}

	var imgId *int64 = nil
	var imgUrl string = ""

	for _, image := range poi.Images {
		if image.ID == input.ImageID {
			imgId = &image.ID
			imgUrl = image.Url
			break
		}
	}

	if imgId == nil {
		err = huma.Error404NotFound("Image not found")
		sp.RecordError(err)
		return err
	}

	var remainingImageIds []int64 = make([]int64, 0)

	for _, image := range poi.Images {
		if image.ID != *imgId {
			remainingImageIds = append(remainingImageIds, image.ID)
		}
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	for i, imgId := range remainingImageIds {
		index, err := utils.SafeInt64ToInt16(int64(i + 1))

		if err != nil {
			sp.RecordError(err)
			return huma.Error500InternalServerError("Internal server error")
		}

		_, err = qtx.UpdatePoiImageIndex(ctx, db.UpdatePoiImageIndexParams{
			ID:    imgId,
			PoiID: poi.ID,
			Index: index,
		})

		if err != nil {
			sp.RecordError(err)
			return huma.Error500InternalServerError("Failed to update image index")
		}
	}

	_, err = qtx.DeletePoiImage(ctx, db.DeletePoiImageParams{
		PoiID: poi.ID,
		ID:    *imgId,
	})

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete image")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to reorder images")
	}

	err = s.App.Upload.RemoveFileFromUrl(imgUrl, upload.BUCKET_POIS)

	if err != nil {
		tracing.Slog.Error("Failed to delete image",
			slog.String("bucket", string(upload.BUCKET_POIS)),
			slog.String("object", imgUrl),
			slog.Any("error", err),
		)
	}

	poi, err = s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	return nil
}

func (s *Service) reorderImages(ctx context.Context, input *dto.ReorderPoiImagesInput) (*dto.ReorderPoiImagesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	poi, err := s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You do not have permission to reorder images")
		sp.RecordError(err)
		return nil, err
	}

	// Check if image IDs are valid, i.e. they are in the database
	for _, imgId := range input.Body.Images {
		flag := true

		for _, image := range poi.Images {
			if image.ID == imgId {
				flag = false
				break
			}
		}

		if flag {
			err = huma.Error400BadRequest("Invalid image ID")
			sp.RecordError(err)
			return nil, err
		}
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.db.WithTx(tx)

	for i, imgId := range input.Body.Images {
		index, err := utils.SafeInt64ToInt16(int64(i + 1))

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		_, err = qtx.UpdatePoiImageIndex(ctx, db.UpdatePoiImageIndexParams{
			ID:    imgId,
			PoiID: poi.ID,
			Index: index,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to update image index")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to reorder images")
	}

	poi, err = s.find(ctx, input.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.ReorderPoiImagesOutput{
		Body: dto.ReorderPoiImagesOutputBody{
			Poi: *poi,
		},
	}, nil
}
