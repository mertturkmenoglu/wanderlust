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
	v := ImageUploadValidator{
		mpf: mpf,
	}

	return v.Validate()
}

func (s *service) uploadMedia(mpf *multipart.Form) (sUploadResult, error) {
	uploader := ImageUploader{
		mpf:     mpf,
		client:  s.uploadClient,
		draftId: mpf.Value["id"][0],
	}

	fileInfo, err := uploader.getSingleFile()

	if err != nil {
		return sUploadResult{}, err
	}

	defer fileInfo.file.Close()

	uploadResult, err := uploader.uploadFile(fileInfo)

	if err != nil {
		return sUploadResult{}, upload.ErrInvalidFile
	}

	return uploadResult, nil
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
