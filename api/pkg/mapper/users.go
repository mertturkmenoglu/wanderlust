package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/utils"
)

func ToProfile(dbProfile db.Profile) dto.Profile {
	return dto.Profile{
		ID:             dbProfile.ID,
		Username:       dbProfile.Username,
		FullName:       dbProfile.FullName,
		IsVerified:     dbProfile.IsVerified,
		Bio:            utils.TextToStr(dbProfile.Bio),
		Pronouns:       utils.TextToStr(dbProfile.Pronouns),
		Website:        utils.TextToStr(dbProfile.Website),
		ProfileImage:   utils.TextToStr(dbProfile.ProfileImage),
		BannerImage:    utils.TextToStr(dbProfile.BannerImage),
		FollowersCount: dbProfile.FollowersCount,
		FollowingCount: dbProfile.FollowingCount,
		CreatedAt:      dbProfile.CreatedAt.Time,
	}
}

func ToFollowers(dbFollowers []db.GetUserFollowersRow) []dto.Profile {
	followers := make([]dto.Profile, len(dbFollowers))

	for i, v := range dbFollowers {
		followers[i] = ToProfile(db.Profile{
			ID:             v.Profile.ID,
			Username:       v.Profile.Username,
			FullName:       v.Profile.FullName,
			IsVerified:     v.Profile.IsVerified,
			Bio:            v.Profile.Bio,
			Pronouns:       v.Profile.Pronouns,
			Website:        v.Profile.Website,
			ProfileImage:   v.Profile.ProfileImage,
			BannerImage:    v.Profile.BannerImage,
			FollowersCount: v.Profile.FollowersCount,
			FollowingCount: v.Profile.FollowingCount,
			CreatedAt:      v.Profile.CreatedAt,
		})
	}

	return followers
}

func ToFollowings(dbFollowings []db.GetUserFollowingRow) []dto.Profile {
	followings := make([]dto.Profile, len(dbFollowings))

	for i, v := range dbFollowings {
		followings[i] = ToProfile(db.Profile{
			ID:             v.Profile.ID,
			Username:       v.Profile.Username,
			FullName:       v.Profile.FullName,
			IsVerified:     v.Profile.IsVerified,
			Bio:            v.Profile.Bio,
			Pronouns:       v.Profile.Pronouns,
			Website:        v.Profile.Website,
			ProfileImage:   v.Profile.ProfileImage,
			BannerImage:    v.Profile.BannerImage,
			FollowersCount: v.Profile.FollowersCount,
			FollowingCount: v.Profile.FollowingCount,
			CreatedAt:      v.Profile.CreatedAt,
		})
	}

	return followings
}

func ToFollowingsFromSearch(dbSearches []db.SearchUserFollowingRow) []dto.Profile {
	followings := make([]dto.Profile, len(dbSearches))

	for i, v := range dbSearches {
		followings[i] = ToProfile(db.Profile{
			ID:             v.Profile.ID,
			Username:       v.Profile.Username,
			FullName:       v.Profile.FullName,
			IsVerified:     v.Profile.IsVerified,
			Bio:            v.Profile.Bio,
			Pronouns:       v.Profile.Pronouns,
			Website:        v.Profile.Website,
			ProfileImage:   v.Profile.ProfileImage,
			BannerImage:    v.Profile.BannerImage,
			FollowersCount: v.Profile.FollowersCount,
			FollowingCount: v.Profile.FollowingCount,
			CreatedAt:      v.Profile.CreatedAt,
		})
	}

	return followings
}

func ToProfileFromUser(dbUser db.User) dto.Profile {
	return dto.Profile{
		ID:             dbUser.ID,
		Username:       dbUser.Username,
		FullName:       dbUser.FullName,
		IsVerified:     dbUser.IsVerified,
		Bio:            utils.TextToStr(dbUser.Bio),
		Pronouns:       utils.TextToStr(dbUser.Pronouns),
		Website:        utils.TextToStr(dbUser.Website),
		ProfileImage:   utils.TextToStr(dbUser.ProfileImage),
		BannerImage:    utils.TextToStr(dbUser.BannerImage),
		FollowersCount: dbUser.FollowersCount,
		FollowingCount: dbUser.FollowingCount,
		CreatedAt:      dbUser.CreatedAt.Time,
	}
}
