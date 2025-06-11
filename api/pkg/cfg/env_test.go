package cfg

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetString(t *testing.T) {
	expected := "foo"
	t.Setenv("__TEST", expected)

	actual := GetString("__TEST")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestGetStringNotSet(t *testing.T) {
	key := "__DO_NOT_USE_THIS_KEY_OR_YOU_WILL_GET_FIRED"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("GetString should panic when key is not set")
		} else {
			expected := fmt.Sprintf("Environment variable %s is not set", key)
			assert.Equal(t, expected, r, "they should be equal")
		}
	}()

	_ = GetString(key)
}

func TestGetIntShouldPass(t *testing.T) {
	expected := 24_601
	t.Setenv("__TEST", fmt.Sprintf("%d", expected))

	actual := GetInt("__TEST")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestGetIntShouldFailWhenItIsNotSet(t *testing.T) {
	key := "__DO_NOT_USE_THIS_KEY_OR_YOU_WILL_GET_FIRED"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("GetInt should panic when key is not set")
		} else {
			expected := fmt.Sprintf("Environment variable %s is not set", key)
			assert.Equal(t, expected, r, "they should be equal")
		}
	}()

	_ = GetInt(key)
}

func TestGetIntShouldFailWhenItIsNotAnInt(t *testing.T) {
	key := "__TEST"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("GetInt should panic when value is not an integer")
		} else {
			expected := fmt.Sprintf("Environment variable %s is not a valid integer", key)
			assert.Equal(t, expected, r, "they should be equal")
		}
	}()

	t.Setenv(key, "foo")

	_ = GetInt("__TEST")
}

func TestGetBoolShouldPass(t *testing.T) {
	expected := true

	t.Setenv("__TEST", fmt.Sprintf("%t", expected))

	actual := GetBool("__TEST")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestGetBoolShouldFailWhenItIsNotSet(t *testing.T) {
	key := "__DO_NOT_USE_THIS_KEY_OR_YOU_WILL_GET_FIRED"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("GetBool should panic when key is not set")
		} else {
			expected := fmt.Sprintf("Environment variable %s is not set", key)
			assert.Equal(t, expected, r, "they should be equal")
		}
	}()

	_ = GetBool(key)
}

func TestGetBoolShouldFailWhenItIsNotABool(t *testing.T) {
	key := "__TEST"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("GetBool should panic when value is not a boolean")
		} else {
			expected := fmt.Sprintf("Environment variable %s is not a valid boolean", key)
			assert.Equal(t, expected, r, "they should be equal")
		}
	}()

	t.Setenv(key, "foo")

	_ = GetBool("__TEST")
}
