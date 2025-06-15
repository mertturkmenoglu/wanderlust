package wiki

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewWikiIDEmptyStringShouldFail(t *testing.T) {
	input := ""
	v, err := NewWikiID(input)

	assert.Error(t, err, "should fail when input is empty string")
	assert.ErrorContains(t, err, "wiki id cannot be empty")
	assert.Nil(t, v)
}

func TestNewWikiIDShouldFailWhenInputDoesNotStartWithLetterQ(t *testing.T) {
	input := "123456"
	v, err := NewWikiID(input)

	assert.Error(t, err, "should fail when input does not start with 'Q'")
	assert.ErrorContains(t, err, "wiki id must start with 'Q'")
	assert.Nil(t, v)
}

func TestNewWikiIDShouldPass(t *testing.T) {
	input := "Q123456"
	v, err := NewWikiID(input)

	assert.NoError(t, err, "should pass when input starts with 'Q'")
	assert.Equal(t, v, &WikiID{value: input})
}

func TestWikiIDStringMethodShouldReturnValue(t *testing.T) {
	input := "Q123456"
	v, err := NewWikiID(input)

	assert.NoError(t, err, "should pass when input starts with 'Q'")
	assert.Equal(t, v.String(), input)
}
