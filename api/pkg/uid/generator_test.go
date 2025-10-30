package uid

import (
	"crypto/rand"
	"math/big"
	"testing"
	"wanderlust/pkg/utils"
)

func TestUUID(t *testing.T) {

	uuid := UUID()

	if uuid == "" {
		t.Errorf("UUID is empty")
	}

	if len(uuid) != 36 {
		t.Error("Expected UUID to be 36 characters long")
	}
}

func TestBase62LenNegative(t *testing.T) {
	actual := Base62(-1)

	if actual != "" {
		t.Errorf("Expected empty string, got %s", actual)
	}
}

func TestBase62LenZero(t *testing.T) {
	actual := Base62(0)

	if actual != "" {
		t.Errorf("Expected empty string, got %s", actual)
	}
}

func TestBase62LenOne(t *testing.T) {
	actual := Base62(1)

	if actual == "" {
		t.Errorf("Expected non-empty string, got %s", actual)
	}

	if len(actual) != 1 {
		t.Errorf("Expected length 1, got %d", len(actual))
	}
}

func TestBase62LenArbitraryPositiveNumber(t *testing.T) {
	bigIntVal, _ := rand.Int(rand.Reader, big.NewInt(100))
	n, _ := utils.SafeInt64ToInt32(bigIntVal.Int64())

	actual := Base62(int(n))

	if actual == "" {
		t.Errorf("Expected non-empty string, got %s", actual)
	}

	if len(actual) != int(n) {
		t.Errorf("Expected length 10, got %d", len(actual))
	}
}

func TestFlake(t *testing.T) {
	flake := Flake()

	if flake == "" {
		t.Errorf("Flake is empty")
	}

	if len(flake) != 18 {
		t.Errorf("Expected flake to be 18 characters long, got %d", len(flake))
	}
}
