// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: copyfrom.go

package db

import (
	"context"
)

// iteratorForBatchCreateAddresses implements pgx.CopyFromSource.
type iteratorForBatchCreateAddresses struct {
	rows                 []BatchCreateAddressesParams
	skippedFirstNextCall bool
}

func (r *iteratorForBatchCreateAddresses) Next() bool {
	if len(r.rows) == 0 {
		return false
	}
	if !r.skippedFirstNextCall {
		r.skippedFirstNextCall = true
		return true
	}
	r.rows = r.rows[1:]
	return len(r.rows) > 0
}

func (r iteratorForBatchCreateAddresses) Values() ([]interface{}, error) {
	return []interface{}{
		r.rows[0].Country,
		r.rows[0].City,
		r.rows[0].Line1,
		r.rows[0].Line2,
		r.rows[0].PostalCode,
		r.rows[0].State,
		r.rows[0].Lat,
		r.rows[0].Lng,
	}, nil
}

func (r iteratorForBatchCreateAddresses) Err() error {
	return nil
}

func (q *Queries) BatchCreateAddresses(ctx context.Context, arg []BatchCreateAddressesParams) (int64, error) {
	return q.db.CopyFrom(ctx, []string{"addresses"}, []string{"country", "city", "line1", "line2", "postal_code", "state", "lat", "lng"}, &iteratorForBatchCreateAddresses{rows: arg})
}

// iteratorForBatchCreatePois implements pgx.CopyFromSource.
type iteratorForBatchCreatePois struct {
	rows                 []BatchCreatePoisParams
	skippedFirstNextCall bool
}

func (r *iteratorForBatchCreatePois) Next() bool {
	if len(r.rows) == 0 {
		return false
	}
	if !r.skippedFirstNextCall {
		r.skippedFirstNextCall = true
		return true
	}
	r.rows = r.rows[1:]
	return len(r.rows) > 0
}

func (r iteratorForBatchCreatePois) Values() ([]interface{}, error) {
	return []interface{}{
		r.rows[0].ID,
		r.rows[0].Name,
		r.rows[0].Phone,
		r.rows[0].Description,
		r.rows[0].AddressID,
		r.rows[0].Website,
		r.rows[0].PriceLevel,
		r.rows[0].AccessibilityLevel,
		r.rows[0].TotalVotes,
		r.rows[0].TotalPoints,
		r.rows[0].TotalFavorites,
		r.rows[0].CategoryID,
		r.rows[0].OpenTimes,
	}, nil
}

func (r iteratorForBatchCreatePois) Err() error {
	return nil
}

func (q *Queries) BatchCreatePois(ctx context.Context, arg []BatchCreatePoisParams) (int64, error) {
	return q.db.CopyFrom(ctx, []string{"pois"}, []string{"id", "name", "phone", "description", "address_id", "website", "price_level", "accessibility_level", "total_votes", "total_points", "total_favorites", "category_id", "open_times"}, &iteratorForBatchCreatePois{rows: arg})
}

// iteratorForCreateBatchUsers implements pgx.CopyFromSource.
type iteratorForCreateBatchUsers struct {
	rows                 []CreateBatchUsersParams
	skippedFirstNextCall bool
}

func (r *iteratorForCreateBatchUsers) Next() bool {
	if len(r.rows) == 0 {
		return false
	}
	if !r.skippedFirstNextCall {
		r.skippedFirstNextCall = true
		return true
	}
	r.rows = r.rows[1:]
	return len(r.rows) > 0
}

func (r iteratorForCreateBatchUsers) Values() ([]interface{}, error) {
	return []interface{}{
		r.rows[0].ID,
		r.rows[0].Email,
		r.rows[0].Username,
		r.rows[0].FullName,
		r.rows[0].PasswordHash,
		r.rows[0].GoogleID,
		r.rows[0].FbID,
		r.rows[0].IsEmailVerified,
		r.rows[0].IsOnboardingCompleted,
		r.rows[0].ProfileImage,
	}, nil
}

func (r iteratorForCreateBatchUsers) Err() error {
	return nil
}

func (q *Queries) CreateBatchUsers(ctx context.Context, arg []CreateBatchUsersParams) (int64, error) {
	return q.db.CopyFrom(ctx, []string{"users"}, []string{"id", "email", "username", "full_name", "password_hash", "google_id", "fb_id", "is_email_verified", "is_onboarding_completed", "profile_image"}, &iteratorForCreateBatchUsers{rows: arg})
}

// iteratorForCreateCities implements pgx.CopyFromSource.
type iteratorForCreateCities struct {
	rows                 []CreateCitiesParams
	skippedFirstNextCall bool
}

func (r *iteratorForCreateCities) Next() bool {
	if len(r.rows) == 0 {
		return false
	}
	if !r.skippedFirstNextCall {
		r.skippedFirstNextCall = true
		return true
	}
	r.rows = r.rows[1:]
	return len(r.rows) > 0
}

func (r iteratorForCreateCities) Values() ([]interface{}, error) {
	return []interface{}{
		r.rows[0].ID,
		r.rows[0].Name,
		r.rows[0].StateID,
		r.rows[0].StateCode,
		r.rows[0].StateName,
		r.rows[0].CountryID,
		r.rows[0].CountryCode,
		r.rows[0].CountryName,
		r.rows[0].Latitude,
		r.rows[0].Longitude,
		r.rows[0].WikiDataID,
	}, nil
}

func (r iteratorForCreateCities) Err() error {
	return nil
}

func (q *Queries) CreateCities(ctx context.Context, arg []CreateCitiesParams) (int64, error) {
	return q.db.CopyFrom(ctx, []string{"cities"}, []string{"id", "name", "state_id", "state_code", "state_name", "country_id", "country_code", "country_name", "latitude", "longitude", "wiki_data_id"}, &iteratorForCreateCities{rows: arg})
}
