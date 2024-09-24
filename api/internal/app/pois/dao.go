package pois

import "wanderlust/internal/db"

type GetPoiByIdDao struct {
	poi       db.Poi
	address   db.Address
	city      db.City
	category  db.Category
	media     []db.Medium
	amenities []db.GetPoiAmenitiesRow
}
