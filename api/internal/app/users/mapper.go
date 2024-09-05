package users

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapGetUserProfileResponseToDto(v db.GetUserProfileByUsernameRow) GetUserProfileResponseDto {
	return GetUserProfileResponseDto{
		ID:                v.ID,
		Username:          v.Username,
		FullName:          v.FullName,
		IsBusinessAccount: v.IsBusinessAccount,
		IsVerified:        v.IsVerified,
		Gender:            utils.TextOrNil(v.Gender),
		Bio:               utils.TextOrNil(v.Bio),
		Pronouns:          utils.TextOrNil(v.Pronouns),
		Website:           utils.TextOrNil(v.Website),
		Phone:             utils.TextOrNil(v.Phone),
		ProfileImage:      utils.TextOrNil(v.ProfileImage),
		BannerImage:       utils.TextOrNil(v.BannerImage),
		FollowersCount:    v.FollowersCount,
		FollowingCount:    v.FollowingCount,
		CreatedAt:         v.CreatedAt.Time,
	}
}
