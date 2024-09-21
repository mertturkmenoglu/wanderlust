package pois

import "time"

// OpenTimes godoc
//
// @Description Open times
type OpenTimes struct {
	Day    string  `json:"day" validate:"required"`
	Open   *string `json:"open"`
	Close  *string `json:"close"`
	Closed bool    `json:"closed" validate:"required"`
} //@name PoisOpenTimes

// PeekPoisResponseDto godoc
//
// @Description Peek pois response dto
type PeekPoisResponseDto struct {
	Pois []PeekPoisItemDto `json:"pois" validate:"required"`
} //@name PoisPeekPoisResponseDto

// PeekPoiItemDto godoc
//
// @Description Peek pois item dto
type PeekPoisItemDto struct {
	ID                 string      `json:"id" example:"528696135489945615" validate:"required"`
	Name               string      `json:"name" example:"Empire State Building" validate:"required"`
	Phone              *string     `json:"phone" example:"+1234567890"`
	Description        string      `json:"description" example:"This is a description" validate:"required"`
	AddressID          int32       `json:"addressId" example:"42" validate:"required"`
	Website            *string     `json:"website" example:"https://example.com"`
	PriceLevel         int16       `json:"priceLevel" example:"2" validate:"required"`
	AccessibilityLevel int16       `json:"accessibilityLevel" example:"3" validate:"required"`
	TotalVotes         int32       `json:"totalVotes" example:"100" validate:"required"`
	TotalPoints        int32       `json:"totalPoints" example:"100" validate:"required"`
	TotalFavorites     int32       `json:"totalFavorites" example:"100" validate:"required"`
	CategoryID         int16       `json:"categoryId" example:"10" validate:"required"`
	OpenTimes          []OpenTimes `json:"openTimes" validate:"required"`
	CreatedAt          time.Time   `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
	UpdatedAt          time.Time   `json:"updatedAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
} //@name PoisPeekPoisItemDto
