package id

import (
	"fmt"
	"wanderlust/pkg/random"

	"github.com/google/uuid"
	"github.com/sony/sonyflake"
)

type Generator struct {
	flake *sonyflake.Sonyflake
}

func NewGenerator(flake *sonyflake.Sonyflake) *Generator {
	return &Generator{
		flake: flake,
	}
}

func (g *Generator) UUID() string {
	return uuid.NewString()
}

func (g *Generator) Flake() string {
	return generateFlake(g.flake)
}

func (g *Generator) Base62(n int) string {
	return random.FromBase62(n)
}

func generateFlake(flake *sonyflake.Sonyflake) string {
	id, err := flake.NextID()

	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("%d", id)
}
