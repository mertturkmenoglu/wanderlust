package pois

import (
	"context"
	"encoding/json"
	"mime/multipart"
	"strings"
	"time"
	"wanderlust/internal/pkg/upload"
)

func (s *service) validateMediaUpload(mpf *multipart.Form) error {
	v := ImageUploadValidator{
		mpf: mpf,
	}

	return v.Validate()
}

func (s *service) deleteMedia(draftId string, name string) error {
	uploader := ImageUploader{
		draftId: draftId,
		client:  s.di.Upload,
		mpf:     nil,
	}

	err := uploader.deleteFile(name)

	if err != nil {
		return err
	}

	draft, _ := s.getDraft(uploader.draftId)
	media, has := draft["media"]

	if !has {
		return nil
	}

	newMedia := make([]interface{}, 0)

	for _, m := range media.([]interface{}) {
		url := m.(map[string]any)["url"].(string)
		if !strings.HasSuffix(url, name) {
			newMedia = append(newMedia, m)
		}
	}

	draft["media"] = newMedia
	err = s.updateDraft(uploader.draftId, draft)

	if err != nil {
		return err
	}

	return nil
}

func (s *service) uploadMedia(mpf *multipart.Form) (sUploadResult, error) {
	uploader := ImageUploader{
		mpf:     mpf,
		client:  s.di.Upload,
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

	s.draftMutex.Lock()
	defer s.draftMutex.Unlock()

	draft, _ := s.getDraft(uploader.draftId)
	media, has := draft["media"]

	if !has {
		media = make([]interface{}, 0)
	}

	draft["media"] = append(media.([]interface{}), map[string]any{
		"type":      "image",
		"url":       uploadResult.url,
		"alt":       fileInfo.alt,
		"caption":   fileInfo.caption,
		"size":      fileInfo.size,
		"order":     fileInfo.mediaOrder,
		"extension": fileInfo.extension,
	})

	err = s.updateDraft(uploader.draftId, draft)

	if err != nil {
		return sUploadResult{}, err
	}

	return uploadResult, nil
}

func (s *service) deleteDraft(id string) error {
	_, err := s.di.Cache.Client.LRem(context.Background(), "poi-drafts", 1, id).Result()

	if err != nil {
		return err
	}

	return s.di.Cache.Del("poi-draft:" + id)
}

func (s *service) updateDraft(id string, body map[string]any) error {
	v, err := json.Marshal(body)

	if err != nil {
		return err
	}

	err = s.di.Cache.Set("poi-draft:"+id, string(v), time.Hour*24*90) // 90 days

	if err != nil {
		return err
	}

	return nil
}

func (s *service) publishDraft(id string) error {
	draft, err := s.getDraft(id)

	if err != nil {
		return err
	}

	err = s.repository.publishDraft(draft)

	if err != nil {
		return err
	}

	return s.deleteDraft(id)
}
