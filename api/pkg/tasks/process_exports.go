package tasks

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"slices"
	"sync"
	"sync/atomic"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

	"github.com/hibiken/asynq"
	"github.com/minio/minio-go/v7"
	"golang.org/x/sync/errgroup"
)

const (
	TypeExportPois = "export:poi"
)

type ExportPoisPayload struct {
	TaskMetadata dto.ExportTaskMetadata
}

type PoiOutput struct {
	ID                 string           `json:"id"`
	Name               string           `json:"name"`
	Phone              *string          `json:"phone"`
	Description        string           `json:"description"`
	Website            *string          `json:"website"`
	PriceLevel         int32            `json:"priceLevel"`
	AccessibilityLevel int32            `json:"accessibilityLevel"`
	CategoryID         int32            `json:"categoryId"`
	Amenities          []int32          `json:"amenities"`
	Hours              dto.PoiHours     `json:"hours"`
	Images             []dto.Image      `json:"images"`
	Address            PoiAddressOutput `json:"address"`
}

type PoiAddressOutput struct {
	ID         int32   `json:"id"`
	CityID     int32   `json:"cityId"`
	Line1      string  `json:"line1"`
	Line2      *string `json:"line2"`
	PostalCode *string `json:"postalCode"`
	Lat        float64 `json:"lat"`
	Lng        float64 `json:"lng"`
}

func (svc *TasksService) ExportPoisTask(ctx context.Context, t *asynq.Task) error {
	p, err := parse[ExportPoisPayload](t.Payload())

	if err != nil {
		return err
	}

	var completed atomic.Int64
	var mu sync.RWMutex
	pois := make([]PoiOutput, 0, len(p.TaskMetadata.IDs))

	g, gctx := errgroup.WithContext(ctx)
	// Limit max workers to 10
	g.SetLimit(10)

	// Split pois into chunks of 100
	// Each chunk will be processed concurrently
	for chunk := range slices.Chunk(p.TaskMetadata.IDs, 100) {
		g.Go(func() error {
			// Read POIs from DB
			chunkPois, err := svc.exportPois(gctx, chunk)

			if err != nil {
				return err
			}

			// Increment completed count
			completed.Add(100)

			// Update task status in Redis
			prog, err := utils.SafeInt64ToInt32(completed.Load() * 100 / int64(len(p.TaskMetadata.IDs)))

			if err != nil {
				return err
			}

			p.TaskMetadata.Progress = prog
			p.TaskMetadata.Status = "inprogress"
			err = svc.cache.SetObj(gctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)

			if err != nil {
				return err
			}

			// Append POIs to global POIs slice
			mu.Lock()
			pois = append(pois, chunkPois...)
			mu.Unlock()

			return nil
		})
	}

	// Wait until all workers are done
	if err := g.Wait(); err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// Update task status in Redis
	p.TaskMetadata.Status = "archiving"
	err = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)

	if err != nil {
		return err
	}

	// First serialize POIs to JSON
	serialized, err := json.Marshal(pois)

	if err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// Create Zip writer
	var buf bytes.Buffer
	zipWriter := zip.NewWriter(&buf)

	// Create a JSON file in the Zip
	jsonFile, err := zipWriter.Create("pois.json")

	if err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// Write serialized POIs to JSON file
	_, err = jsonFile.Write(serialized)

	if err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// We are done with the Zip, so close it
	err = zipWriter.Close()

	if err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// Zip file is inside buf
	// Create a reader so we can use it with MinIO
	reader := bytes.NewReader(buf.Bytes())

	// Put buf (Zip file) to MinIO
	_, err = svc.uploadSvc.Client.PutObject(
		ctx,
		string(upload.BUCKET_EXPORTS),
		p.TaskMetadata.ID+".zip",
		reader,
		int64(buf.Len()),
		minio.PutObjectOptions{
			ContentType: "application/zip",
		},
	)

	if err != nil {
		p.TaskMetadata.Status = "failed"
		errMsg := err.Error()
		p.TaskMetadata.Error = &errMsg
		_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)
		return err
	}

	// Set as completed
	p.TaskMetadata.Status = "completed"
	p.TaskMetadata.Error = nil
	var file = svc.uploadSvc.GetUrlForFile(upload.BUCKET_EXPORTS, p.TaskMetadata.ID+".zip")
	p.TaskMetadata.File = &file
	p.TaskMetadata.Progress = 100
	_ = svc.cache.SetObj(ctx, cache.KeyBuilder("export", p.TaskMetadata.ID), p.TaskMetadata, 0)

	return nil
}

func (svc *TasksService) exportPois(
	ctx context.Context,
	ids []string,
) ([]PoiOutput, error) {
	dbPois, err := svc.db.Queries.GetPoisByIdsPopulated(ctx, ids)

	if err != nil {
		return nil, err
	}

	pois, err := mapper.ToPois(dbPois[0])

	if err != nil {
		return nil, err
	}

	output := make([]PoiOutput, len(pois))

	for i, poi := range pois {
		amenities := make([]int32, len(poi.Amenities))

		for j, amenity := range poi.Amenities {
			amenities[j] = int32(amenity.ID)
		}

		output[i] = PoiOutput{
			ID:                 poi.ID,
			Name:               poi.Name,
			Phone:              poi.Phone,
			Description:        poi.Description,
			Website:            poi.Website,
			PriceLevel:         int32(poi.PriceLevel),
			AccessibilityLevel: int32(poi.AccessibilityLevel),
			CategoryID:         int32(poi.CategoryID),
			Amenities:          amenities,
			Hours:              poi.Hours,
			Images:             poi.Images,
			Address: PoiAddressOutput{
				ID:         poi.Address.ID,
				CityID:     poi.Address.CityID,
				Line1:      poi.Address.Line1,
				Line2:      poi.Address.Line2,
				PostalCode: poi.Address.PostalCode,
				Lat:        poi.Address.Lat,
				Lng:        poi.Address.Lng,
			},
		}
	}

	return output, nil
}
