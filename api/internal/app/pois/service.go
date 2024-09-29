package pois

import (
	"context"
	"encoding/json"
	"errors"
	"mime/multipart"
	"time"
	"wanderlust/internal/db"
	"wanderlust/internal/upload"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/minio/minio-go/v7"
)

func (s *service) peekPois() ([]db.Poi, error) {
	res, err := s.repository.peekPois()

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []db.Poi{}, nil
		}

		return []db.Poi{}, err
	}

	return res, nil
}

func (s *service) getPoiById(id string) (GetPoiByIdResponseDto, error) {
	dao, err := s.repository.getPoiById(id)

	if err != nil {
		return GetPoiByIdResponseDto{}, err
	}

	return mapGetPoiByIdToDto(dao)
}

func (s *service) isFavorite(poiId string, userId string) bool {
	return s.repository.isFavorite(poiId, userId)
}

func (s *service) isBookmarked(poiId string, userId string) bool {
	return s.repository.isBookmarked(poiId, userId)
}

func (s *service) validateMediaUpload(mpf *multipart.Form) error {
	files := mpf.File["files"]

	if files == nil {
		return upload.ErrInvalidNumberOfFiles
	}

	num := len(files)

	if !isAllowedCount(num) {
		return upload.ErrInvalidNumberOfFiles
	}

	// Check content type and size
	for _, f := range files {
		mime := f.Header.Get("Content-Type")

		if !isAllowedMimeType(mime) {
			return upload.ErrInvalidMimeType
		}

		if !isAllowedFileSize(f.Size) {
			return upload.ErrFileTooBig
		}
	}

	return nil
}

func (s *service) uploadMedia(mpf *multipart.Form) ([]echo.Map, error) {
	bucket := "pois"
	files := mpf.File["files"]
	res := make([]echo.Map, 0)

	for _, f := range files {
		file, err := f.Open()

		if err != nil {
			return nil, err
		}

		defer file.Close()

		// Generate a random key
		key := uuid.New().String()
		mime := f.Header.Get("Content-Type")
		fileExtension, err := upload.GetFileExtensionFromMimeType(mime)

		if err != nil {
			return nil, err
		}

		// key and file extension combined to create a file name
		fileName := upload.ConstructFilename(key, fileExtension)

		info, err := s.uploadClient.Client.PutObject(
			context.Background(),
			bucket,
			fileName,
			file,
			int64(f.Size),
			minio.PutObjectOptions{},
		)

		if err != nil {
			return nil, err
		}

		res = append(res, echo.Map{
			"key":  key,
			"info": info,
			"url":  "/" + info.Bucket + "/" + info.Key,
		})
	}

	return res, nil
}

func (s *service) createDraft() (map[string]any, error) {
	id := uuid.New().String()
	draft := map[string]any{
		"id": id,
		"v":  1,
	}

	v, err := json.Marshal(draft)

	if err != nil {
		return nil, err
	}

	err = s.cache.Set("poi-draft:"+id, string(v), time.Hour*24*90) // 90 days

	if err != nil {
		return nil, err
	}

	_, err = s.cache.Client.LPush(context.Background(), "poi-drafts", id).Result()

	if err != nil {
		return nil, err
	}

	return draft, nil
}

func (s *service) getDrafts() ([]map[string]any, error) {
	ids, err := s.cache.Client.LRange(context.Background(), "poi-drafts", 0, -1).Result()

	if err != nil {
		return nil, err
	}

	var drafts []map[string]any

	for _, id := range ids {
		v, err := s.cache.Get("poi-draft:" + id)

		if err != nil {
			return nil, err
		}

		var draft map[string]any

		err = json.Unmarshal([]byte(v), &draft)

		if err != nil {
			return nil, err
		}

		drafts = append(drafts, draft)
	}

	return drafts, nil
}

func (s *service) getDraft(id string) (map[string]any, error) {
	v, err := s.cache.Get("poi-draft:" + id)

	if err != nil {
		return nil, err
	}

	var draft map[string]any

	err = json.Unmarshal([]byte(v), &draft)

	if err != nil {
		return nil, err
	}

	return draft, nil
}

func (s *service) deleteDraft(id string) error {
	_, err := s.cache.Client.LRem(context.Background(), "poi-drafts", 1, id).Result()

	if err != nil {
		return err
	}

	return s.cache.Del("poi-draft:" + id)
}

func (s *service) updateDraft(id string, body map[string]any) error {
	v, err := json.Marshal(body)

	if err != nil {
		return err
	}

	err = s.cache.Set("poi-draft:"+id, string(v), time.Hour*24*90) // 90 days

	if err != nil {
		return err
	}

	return nil
}
