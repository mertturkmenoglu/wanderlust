// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Address struct {
	ID         int32
	CityID     int32
	Line1      string
	Line2      pgtype.Text
	PostalCode pgtype.Text
	Lat        float64
	Lng        float64
}

type AmenitiesPoi struct {
	AmenityID int32
	PoiID     string
}

type Amenity struct {
	ID   int32
	Name string
}

type Bookmark struct {
	ID        int32
	PoiID     string
	UserID    string
	CreatedAt pgtype.Timestamptz
}

type Category struct {
	ID    int16
	Name  string
	Image string
}

type City struct {
	ID          int32
	Name        string
	StateCode   string
	StateName   string
	CountryCode string
	CountryName string
	ImageUrl    string
	Latitude    float64
	Longitude   float64
	Description string
}

type Collection struct {
	ID          string
	Name        string
	Description string
	CreatedAt   pgtype.Timestamptz
}

type CollectionItem struct {
	CollectionID string
	PoiID        string
	ListIndex    int32
	CreatedAt    pgtype.Timestamptz
}

type Favorite struct {
	ID        int32
	PoiID     string
	UserID    string
	CreatedAt pgtype.Timestamptz
}

type Follow struct {
	FollowerID  string
	FollowingID string
	CreatedAt   pgtype.Timestamptz
}

type Medium struct {
	ID         int64
	PoiID      string
	Url        string
	Alt        string
	Caption    pgtype.Text
	MediaOrder int16
	CreatedAt  pgtype.Timestamptz
}

type Poi struct {
	ID                 string
	Name               string
	Phone              pgtype.Text
	Description        string
	AddressID          int32
	Website            pgtype.Text
	PriceLevel         int16
	AccessibilityLevel int16
	TotalVotes         int32
	TotalPoints        int32
	TotalFavorites     int32
	CategoryID         int16
	OpenTimes          []byte
	CreatedAt          pgtype.Timestamptz
	UpdatedAt          pgtype.Timestamptz
}

type Session struct {
	ID          string
	UserID      string
	SessionData pgtype.Text
	CreatedAt   pgtype.Timestamptz
	ExpiresAt   pgtype.Timestamptz
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
