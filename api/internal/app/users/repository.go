package users

import (
	"context"
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func (r *repository) GetUserProfile(username string) (db.GetUserProfileByUsernameRow, error) {
	return r.db.Queries.GetUserProfileByUsername(context.Background(), username)
}

func (r *repository) makeUserVerified(id string) error {
	return r.db.Queries.MakeUserVerified(context.Background(), id)
}

func (r *repository) updateUserProfile(id string, dto UpdateUserProfileRequestDto) (db.User, error) {
	return r.db.Queries.UpdateUserProfile(context.Background(), db.UpdateUserProfileParams{
		ID:       id,
		FullName: dto.FullName,
		Gender:   utils.NilStrToText(dto.Gender),
		Bio:      utils.NilStrToText(dto.Bio),
		Pronouns: utils.NilStrToText(dto.Pronouns),
		Website:  utils.NilStrToText(dto.Website),
		Phone:    utils.NilStrToText(dto.Phone),
	})
}

func (r *repository) updateProfileImage(userId string, imageUrl string) error {
	return r.db.Queries.UpdateUserProfileImage(context.Background(), db.UpdateUserProfileImageParams{
		ID:           userId,
		ProfileImage: utils.StrToText(imageUrl),
	})
}
