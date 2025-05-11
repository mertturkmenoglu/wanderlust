package utils

import "github.com/jackc/pgx/v5/pgtype"

// Convert a pgtype.Text to a nillable string
func TextToStr(v pgtype.Text) *string {
	if v.Valid {
		return &v.String
	}

	return nil
}

// Convert a string to a pgtype.Text
func StrToText(v string) pgtype.Text {
	return pgtype.Text{String: v, Valid: true}
}

// Convert a nillable string to a pgtype.Text.
// If you are sure string is not nillable, use StrToText instead.
func NilStrToText(v *string) pgtype.Text {
	if v == nil {
		return pgtype.Text{}
	}

	return StrToText(*v)
}
