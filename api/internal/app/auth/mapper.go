package auth

import "wanderlust/internal/db"

func mapGetMeResponseToDto(v db.User) GetMeResponseDto {
	var gender *string = nil

	if v.Gender.Valid {
		gender = &v.Gender.String
	}

	var profileImage *string = nil

	if v.ProfileImage.Valid {
		profileImage = &v.ProfileImage.String
	}

	var googleId *string = nil

	if v.GoogleID.Valid {
		googleId = &v.GoogleID.String
	}

	var fbId *string = nil

	if v.FbID.Valid {
		fbId = &v.FbID.String
	}

	return GetMeResponseDto{
		ID:              v.ID,
		Email:           v.Email,
		Username:        v.Username,
		FullName:        v.FullName,
		GoogleID:        googleId,
		FacebookID:      fbId,
		IsEmailVerified: v.IsEmailVerified,
		IsActive:        v.IsActive,
		Role:            v.Role,
		Gender:          gender,
		ProfileImage:    profileImage,
		LastLogin:       v.LastLogin.Time,
		CreatedAt:       v.CreatedAt.Time,
		UpdatedAt:       v.UpdatedAt.Time,
	}
}
