package utils

import (
	"fmt"

	"github.com/sony/sonyflake"
)

// Generates a unique Flake ID, converts it to string, and returns it.
func GenerateId(flake *sonyflake.Sonyflake) string {
	id, err := flake.NextID()

	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("%d", id)
}
