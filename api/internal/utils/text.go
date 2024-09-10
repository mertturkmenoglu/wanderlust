package utils

import "github.com/jackc/pgx/v5/pgtype"

func TextOrNil(v pgtype.Text) *string {
	if v.Valid {
		return &v.String
	}

	return nil
}

func StrToText(v string) pgtype.Text {
	return pgtype.Text{String: v, Valid: true}
}
