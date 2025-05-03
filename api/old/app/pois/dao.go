package pois

import "wanderlust/internal/pkg/db"

type GetPoiByIdDao struct {
	Poi       db.Poi
	Address   db.Address
	City      db.City
	Category  db.Category
	Media     []db.Medium
	Amenities []db.GetPoiAmenitiesRow
}
