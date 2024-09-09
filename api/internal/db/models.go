// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Address struct {
	ID         int32
	Country    string
	City       string
	Line1      string
	Line2      pgtype.Text
	PostalCode pgtype.Text
	State      pgtype.Text
	Lat        float64
	Lng        float64
}

type Category struct {
	ID    int16
	Name  string
	Image string
}

type City struct {
	ID          int32
	Name        string
	StateID     int32
	StateCode   string
	CountryID   int32
	CountryCode string
	CountryName string
	Latitude    float64
	Longitude   float64
	WikiDataID  string
}

type Country struct {
	ID             int32
	Name           string
	Iso2           string
	NumericCode    string
	PhoneCode      string
	Capital        string
	Currency       string
	CurrencyName   string
	CurrencySymbol string
	Tld            string
	Native         string
	Region         string
	Subregion      string
	Timezones      string
	Latitude       float64
	Longitude      float64
}

type Medium struct {
	ID         int64
	PoiID      string
	Url        string
	Thumbnail  string
	Alt        string
	Caption    pgtype.Text
	Width      int32
	Height     int32
	MediaOrder int16
	Extension  string
	MimeType   string
	FileSize   int64
	CreatedAt  pgtype.Timestamptz
}

type Session struct {
	ID          string
	UserID      string
	SessionData pgtype.Text
	CreatedAt   pgtype.Timestamptz
	ExpiresAt   pgtype.Timestamptz
}

type State struct {
	ID          int32
	Name        string
	CountryID   int32
	CountryCode string
	CountryName string
	StateCode   string
	Type        pgtype.Text
	Latitude    float64
	Longitude   float64
}

type User struct {
	ID                    string
	Email                 string
	Username              string
	FullName              string
	PasswordHash          pgtype.Text
	GoogleID              pgtype.Text
	FbID                  pgtype.Text
	IsEmailVerified       bool
	IsOnboardingCompleted bool
	IsActive              bool
	IsBusinessAccount     bool
	IsVerified            bool
	Role                  string
	PasswordResetToken    pgtype.Text
	PasswordResetExpires  pgtype.Timestamptz
	LoginAttempts         pgtype.Int4
	LockoutUntil          pgtype.Timestamptz
	Gender                pgtype.Text
	Bio                   pgtype.Text
	Pronouns              pgtype.Text
	Website               pgtype.Text
	Phone                 pgtype.Text
	ProfileImage          pgtype.Text
	BannerImage           pgtype.Text
	FollowersCount        int32
	FollowingCount        int32
	LastLogin             pgtype.Timestamptz
	CreatedAt             pgtype.Timestamptz
	UpdatedAt             pgtype.Timestamptz
}
