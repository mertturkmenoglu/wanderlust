package auth

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapGetMeResponseToDto(v db.User) GetMeResponseDto {
	return GetMeResponseDto{
		ID:                    v.ID,
		Email:                 v.Email,
		Username:              v.Username,
		FullName:              v.FullName,
		GoogleID:              utils.TextOrNil(v.GoogleID),
		FacebookID:            utils.TextOrNil(v.FbID),
		IsEmailVerified:       v.IsEmailVerified,
		IsOnboardingCompleted: v.IsOnboardingCompleted,
		IsActive:              v.IsActive,
		IsBusinessAccount:     v.IsBusinessAccount,
		IsVerified:            v.IsVerified,
		Role:                  v.Role,
		Bio:                   utils.TextOrNil(v.Bio),
		Pronouns:              utils.TextOrNil(v.Pronouns),
		Website:               utils.TextOrNil(v.Website),
		Phone:                 utils.TextOrNil(v.Phone),
		ProfileImage:          utils.TextOrNil(v.ProfileImage),
		BannerImage:           utils.TextOrNil(v.BannerImage),
		FollowersCount:        v.FollowersCount,
		FollowingCount:        v.FollowingCount,
		LastLogin:             v.LastLogin.Time,
		CreatedAt:             v.CreatedAt.Time,
		UpdatedAt:             v.UpdatedAt.Time,
	}
}
