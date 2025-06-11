package cache

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestKeyBuilderZeroArgs(t *testing.T) {
	expected := ""

	actual := KeyBuilder()

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderOneArg(t *testing.T) {
	expected := "foo"

	actual := KeyBuilder("foo")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderManyArgs(t *testing.T) {
	expected := "foo:bar:baz"

	actual := KeyBuilder("foo", "bar", "baz")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderEmptyString(t *testing.T) {
	expected := ""

	actual := KeyBuilder("")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderEmptyStringInMiddle(t *testing.T) {
	expected := "foo::bar"

	actual := KeyBuilder("foo", "", "bar")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderEmptyStringAtStart(t *testing.T) {
	expected := ":bar"

	actual := KeyBuilder("", "bar")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderEmptyStringAtEnd(t *testing.T) {
	expected := "foo:"

	actual := KeyBuilder("foo", "")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderEmptyStringAtBothEnds(t *testing.T) {
	expected := ":"

	actual := KeyBuilder("", "")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderInputWithColon(t *testing.T) {
	expected := "foo:bar"

	actual := KeyBuilder("foo:bar")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderInputWithColon2(t *testing.T) {
	expected := "foo:bar:baz"

	actual := KeyBuilder("foo:bar", "baz")

	assert.Equal(t, expected, actual, "they should be equal")
}

func TestKeyBuilderLargeInput(t *testing.T) {
	expected := strings.Repeat("foo:", 100)
	expected = expected[:len(expected)-1]

	var input []string

	for range 100 {
		input = append(input, "foo")
	}

	actual := KeyBuilder(input...)

	assert.Equal(t, expected, actual, "they should be equal")
}
