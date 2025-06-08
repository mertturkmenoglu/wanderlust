package mapper

import (
	"encoding/json"
	"wanderlust/pkg/dto"
)

func ToPois(data []byte) ([]dto.Poi, error) {
	if len(data) == 0 {
		return []dto.Poi{}, nil
	}

	var pois []dto.Poi

	err := json.Unmarshal(data, &pois)

	if err != nil {
		return nil, err
	}

	for i, p := range pois {
		if p.Amenities == nil {
			pois[i].Amenities = []dto.Amenity{}
		}

		if p.Images == nil {
			pois[i].Images = []dto.Image{}
		}
	}

	return pois, nil
}
