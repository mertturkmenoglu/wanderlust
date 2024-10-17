package users

import (
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapGetUserProfileResponseToDto(v db.GetUserProfileByUsernameRow) GetUserProfileResponseDto {
	return GetUserProfileResponseDto{
		ID:                v.ID,
		Username:          v.Username,
		FullName:          v.FullName,
		IsBusinessAccount: v.IsBusinessAccount,
		IsVerified:        v.IsVerified,
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

func mapUpdateUserProfileResponseToDto(v db.User) UpdateUserProfileResponseDto {
	return UpdateUserProfileResponseDto{
		ID:                v.ID,
		Username:          v.Username,
		FullName:          v.FullName,
		IsBusinessAccount: v.IsBusinessAccount,
		IsVerified:        v.IsVerified,
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

func mapToGetUserFollowersResponseDto(v []db.GetUserFollowersRow) GetUserFollowersResponseDto {
	followers := make([]GetUserProfileResponseDto, 0)

	for _, follower := range v {
		followers = append(followers, mapToGetUserProfileResponseDto(follower.User))
	}

	return GetUserFollowersResponseDto{
		Followers: followers,
	}
}

func mapToGetUserFollowingResponseDto(v []db.GetUserFollowingRow) GetUserFollowingResponseDto {
	following := make([]GetUserProfileResponseDto, 0)

	for _, followingUser := range v {
		following = append(following, mapToGetUserProfileResponseDto(followingUser.User))
	}

	return GetUserFollowingResponseDto{
		Following: following,
	}
}

func mapToSearchUserFollowingResponseDto(v []db.SearchUserFollowingRow) SearchUserFollowingResponseDto {
	friends := make([]GetUserProfileResponseDto, 0)

	for _, friend := range v {
		friends = append(friends, mapToGetUserProfileResponseDto(friend.User))
	}

	return SearchUserFollowingResponseDto{
		Friends: friends,
	}
}

func mapToGetUserProfileResponseDto(v db.User) GetUserProfileResponseDto {
	return GetUserProfileResponseDto{
		ID:                v.ID,
		Username:          v.Username,
		FullName:          v.FullName,
		IsBusinessAccount: v.IsBusinessAccount,
		IsVerified:        v.IsVerified,
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
