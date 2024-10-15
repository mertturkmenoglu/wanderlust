package users

import (
	"errors"
	"mime/multipart"
	errs "wanderlust/internal/pkg/core/errors"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/upload"

	"github.com/jackc/pgx/v5"
)

func (s *service) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	res, err := s.repository.GetUserProfile(username)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.GetUserProfileByUsernameRow{}, ErrUserNotFound
		}

		return db.GetUserProfileByUsernameRow{}, errs.InternalServerError
	}

	return res, nil
}

func (s *service) makeUserVerified(id string) error {
	return s.repository.makeUserVerified(id)
}

func (s *service) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (UpdateUserProfileResponseDto, error) {
	res, err := s.repository.updateUserProfile(id, dto)

	if err != nil {
		return UpdateUserProfileResponseDto{}, err
	}

	v := mapUpdateUserProfileResponseToDto(res)

	return v, nil
}

func (s *service) validateProfileImageMPF(mpf *multipart.Form) error {
	validator := sImageUploadValidator{
		action: updateProfileImage,
		mpf:    mpf,
	}

	return validator.Validate()
}

func (s *service) validateBannerImageMPF(mpf *multipart.Form) error {
	validator := sImageUploadValidator{
		action: updateBannerImage,
		mpf:    mpf,
	}

	return validator.Validate()
}

func (s *service) updateProfileImage(user db.User, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		action:   updateProfileImage,
		mpf:      mpf,
		client:   s.di.Upload,
		username: user.Username,
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

	err = s.repository.updateProfileImage(user.ID, url)

	if err != nil {
		return "", err
	}

	_ = uploader.DeleteOldFile(fileInfo)

	return url, nil
}

func (s *service) updateBannerImage(user db.User, mpf *multipart.Form) (string, error) {
	uploader := sImageUploader{
		action:   updateBannerImage,
		mpf:      mpf,
		client:   s.di.Upload,
		username: user.Username,
	}

	fileInfo, err := uploader.GetSingleFile()

	if err != nil {
		return "", err
	}

	defer fileInfo.file.Close()

	url, err := uploader.UploadFile(fileInfo)

	if err != nil {
		return "", err
	}

	err = s.repository.updateBannerImage(user.ID, url)

	if err != nil {
		return "", err
	}

	_ = uploader.DeleteOldFile(fileInfo)

	return url, nil
}

func (s *service) isUserFollowing(thisUserId string, otherUserId string) (bool, error) {
	if thisUserId == otherUserId {
		return false, nil
	}

	isFollowing, err := s.repository.isUserFollowing(thisUserId, otherUserId)

	if err != nil {
		return false, err
	}

	return isFollowing, nil
}

func (s *service) changeFollow(isFollowing bool, thisUserId string, otherUserId string) error {
	if isFollowing {
		return s.repository.unfollow(thisUserId, otherUserId)
	}

	return s.repository.follow(thisUserId, otherUserId)
}
