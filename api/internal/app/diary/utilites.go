package diary

import "math"

type Coordinate struct {
	Lat  float64
	Long float64
}

func GetCenterPoint(coordinates []Coordinate) Coordinate {
	if len(coordinates) < 1 {
		return Coordinate{
			Lat:  0,
			Long: 0,
		}
	}

	if len(coordinates) == 1 {
		return coordinates[0]
	}

	var (
		x = 0.0
		y = 0.0
		z = 0.0
	)

	for _, coordinate := range coordinates {
		lat := coordinate.Lat * math.Pi / 180
		long := coordinate.Long * math.Pi / 180

		x += math.Cos(lat) * math.Cos(long)
		y += math.Cos(lat) * math.Sin(long)
		z += math.Sin(lat)
	}

	total := float64(len(coordinates))

	x /= total
	y /= total
	z /= total

	centralLongitude := math.Atan2(y, x)
	centralSquareRoot := math.Sqrt(x*x + y*y)
	centralLatitude := math.Atan2(z, centralSquareRoot)

	return Coordinate{
		Lat:  centralLatitude * 180 / math.Pi,
		Long: centralLongitude * 180 / math.Pi,
	}
}
