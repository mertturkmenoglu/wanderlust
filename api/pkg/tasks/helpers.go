package tasks

import "encoding/json"

func parse[T any](serialized []byte) (*T, error) {
	var p T

	err := json.Unmarshal(serialized, &p)

	if err != nil {
		return nil, err
	}

	return &p, nil
}
