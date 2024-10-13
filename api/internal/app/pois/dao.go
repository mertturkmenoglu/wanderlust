package pois

import "wanderlust/internal/db"

type GetPoiByIdDao struct {
	Poi       db.Poi
	Address   db.Address
	City      db.City
	Category  db.Category
	Media     []db.Medium
	Amenities []db.GetPoiAmenitiesRow
}
