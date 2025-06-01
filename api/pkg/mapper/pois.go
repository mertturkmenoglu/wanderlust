package mapper

import (
	"encoding/json"
	"wanderlust/pkg/dto"
)

func ToPois(data []byte) ([]dto.Poi, error) {
	var pois []dto.Poi

	err := json.Unmarshal(data, &pois)

	if err != nil {
		return nil, err
	}

	for i, p := range pois {
		if p.Amenities == nil {
			pois[i].Amenities = []dto.Amenity{}
		}

		if p.Media == nil {
			pois[i].Media = []dto.Media{}
		}
	}

	return pois, nil
}
