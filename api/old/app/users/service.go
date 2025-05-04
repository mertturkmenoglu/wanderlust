package users

import (
	"context"
	"encoding/json"
	"mime/multipart"
	"wanderlust/internal/pkg/cache"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/upload"
)

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

func (s *service) changeFollow(isFollowing bool, thisUserId string, otherUserId string) error {
	if isFollowing {
		return s.repository.unfollow(thisUserId, otherUserId)
	}

	return s.repository.follow(thisUserId, otherUserId)
}
