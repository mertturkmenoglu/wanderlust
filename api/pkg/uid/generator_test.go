package uid

import (
	"crypto/rand"
	"math/big"
	"testing"
	"wanderlust/pkg/utils"

	"github.com/sony/sonyflake"
)

func setup() *Generator {
	return NewGenerator(sonyflake.NewSonyflake(sonyflake.Settings{}))
}

func TestUUID(t *testing.T) {
	g := setup()

	uuid := g.UUID()

	if uuid == "" {
		t.Errorf("UUID is empty")
	}

	if len(uuid) != 36 {
		t.Error("Expected UUID to be 36 characters long")
	}
}

func TestBase62LenNegative(t *testing.T) {
	g := setup()

	actual := g.Base62(-1)

	if actual != "" {
		t.Errorf("Expected empty string, got %s", actual)
	}
}

func TestBase62LenZero(t *testing.T) {
	g := setup()

	actual := g.Base62(0)

	if actual != "" {
		t.Errorf("Expected empty string, got %s", actual)
	}
}

func TestBase62LenOne(t *testing.T) {
	g := setup()

	actual := g.Base62(1)

	if actual == "" {
		t.Errorf("Expected non-empty string, got %s", actual)
	}

	if len(actual) != 1 {
		t.Errorf("Expected length 1, got %d", len(actual))
	}
}

func TestBase62LenArbitraryPositiveNumber(t *testing.T) {
	g := setup()

	bigIntVal, _ := rand.Int(rand.Reader, big.NewInt(100))
	n, _ := utils.SafeInt64ToInt32(bigIntVal.Int64())

	actual := g.Base62(int(n))

	if actual == "" {
		t.Errorf("Expected non-empty string, got %s", actual)
	}

	if len(actual) != int(n) {
		t.Errorf("Expected length 10, got %d", len(actual))
	}
}

func TestFlake(t *testing.T) {
	g := setup()

	flake := g.Flake()

	if flake == "" {
		t.Errorf("Flake is empty")
	}

	if len(flake) != 18 {
		t.Errorf("Expected flake to be 18 characters long, got %d", len(flake))
	}
}
