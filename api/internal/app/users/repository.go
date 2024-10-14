package users

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func (r *repository) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	return r.di.Db.Queries.GetUserProfileByUsername(context.Background(), username)
}

func (r *repository) makeUserVerified(id string) error {
	return r.di.Db.Queries.MakeUserVerified(context.Background(), id)
}

func (r *repository) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (db.User, error) {
	return r.di.Db.Queries.UpdateUserProfile(context.Background(), db.UpdateUserProfileParams{
		ID:       id,
		FullName: dto.FullName,
		Bio:      utils.NilStrToText(dto.Bio),
		Pronouns: utils.NilStrToText(dto.Pronouns),
		Website:  utils.NilStrToText(dto.Website),
		Phone:    utils.NilStrToText(dto.Phone),
	})
}

func (r *repository) updateProfileImage(userId string, imageUrl string) error {
	return r.di.Db.Queries.UpdateUserProfileImage(context.Background(), db.UpdateUserProfileImageParams{
		ID:           userId,
		ProfileImage: utils.StrToText(imageUrl),
	})
}

func (r *repository) updateBannerImage(userId string, imageUrl string) error {
	return r.di.Db.Queries.UpdateUserBannerImage(context.Background(), db.UpdateUserBannerImageParams{
		ID:          userId,
		BannerImage: utils.StrToText(imageUrl),
	})
}
