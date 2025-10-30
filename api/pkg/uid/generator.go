package uid

import (
	"fmt"
	"wanderlust/pkg/random"

	"github.com/google/uuid"
	"github.com/sony/sonyflake"
)

var defaultFlake = sonyflake.NewSonyflake(sonyflake.Settings{})

func UUID() string {
	return uuid.NewString()
}

func Flake() string {
	return generateFlake(defaultFlake)
}

func Base62(n int) string {
	return random.FromBase62(n)
}

func generateFlake(flake *sonyflake.Sonyflake) string {
	id, err := flake.NextID()

	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("%d", id)
}
