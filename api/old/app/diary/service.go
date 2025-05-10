package diary

import (
	"mime/multipart"
	"strings"
	"wanderlust/internal/pkg/tasks"
	"wanderlust/internal/pkg/upload"
)

func (s *service) createNewDiaryEntry(userId string, dto CreateDiaryEntryRequestDto) (CreateDiaryEntryResponseDto, error) {
	res, err := s.repository.createNewDiaryEntry(userId, dto)

	if err != nil {
		return CreateDiaryEntryResponseDto{}, err
	}

	resDto := mapToCreateDiaryEntryResponseDto(res)

	return resDto, nil
}

func (s *service) validateMediaMPF(mpf *multipart.Form) error {
	validator := sImageUploadValidator{
		mpf: mpf,
	}

	return validator.Validate()
}

func (s *service) uploadMedia(id string, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		mpf:    mpf,
		client: s.di.Upload,
	}

	fileInfo, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer fileInfo.file.Close()

	url, err := uploader.UploadFile(fileInfo)

	if err != nil {
		return "", upload.ErrInvalidFile
	}

	err = s.repository.addMedia(id, url, fileInfo)

	if err != nil {
		return "", err
	}

	return url, nil
}

func (s *service) deleteDiaryEntry(id string) error {
	media, mediaErr := s.repository.getDiaryMedia(id)

	err := s.repository.deleteDiaryEntry(id)

	if err != nil {
		return err
	}

	if mediaErr != nil {
		return nil
	}

	objectNames := make([]string, 0)

	for _, m := range media {
		_, after, found := strings.Cut(m.Url, "diaries/")

		if !found {
			s.di.Logger.Error("error deleting diary media, cannot extract object name from url", s.di.Logger.Args("url", m.Url))
			continue
		}

		name := after
		objectNames = append(objectNames, name)
	}

	_, err = s.di.Tasks.CreateAndEnqueue(tasks.TypeDeleteDiaryMedia, tasks.DeleteDiaryMediaPayload{
		ObjectNames: objectNames,
	})

	if err != nil {
		s.di.Logger.Error(
			"error deleting diary media",
			s.di.Logger.Args("id", id, "err", err, "media", media, "object names", objectNames),
		)
	}

	return nil
}
