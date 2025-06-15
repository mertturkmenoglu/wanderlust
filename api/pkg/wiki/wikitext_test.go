package wiki

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRemoveFootnotesShouldPassWhenGivenEmptyString(t *testing.T) {
	input := ""
	actual := RemoveFootnotes(input)
	assert.Equal(t, input, actual)
}

func TestRemoveFootnotesShouldPass(t *testing.T) {
	input := `
		Lorem [1] ipsum [2] dolor sit amet.

		[1]: https://example.com/1
		[2]: https://example.com/2
	`

	expected := `
		Lorem  ipsum  dolor sit amet.

		: https://example.com/1
		: https://example.com/2
	`

	actual := RemoveFootnotes(input)
	assert.Equal(t, expected, actual)
}

func TestRemoveFootnotesShouldNotRemoveIfBracketsContainAlphabetCharacters(t *testing.T) {
	input := `
		Lorem [abc] ipsum [2 def] dolor sit amet.

		[1]: https://example.com/1
		[2]: https://example.com/2
	`

	expected := `
		Lorem [abc] ipsum [2 def] dolor sit amet.

		: https://example.com/1
		: https://example.com/2
	`

	actual := RemoveFootnotes(input)
	assert.Equal(t, expected, actual)
}

func TestGetWikiTextFirstSectionShouldErrWhenInputIsEmptyString(t *testing.T) {
	input := ""
	_, err := GetWikiTextFirstSection(input)
	assert.Error(t, err, "should fail when input is empty string")
	assert.ErrorContains(t, err, "no section delimiter found in wikitext")
}

func TestGetWikiTextFirstSectionShouldErrWhenNoSectionDelimiterFound(t *testing.T) {
	input := `
		Lorem ipsum dolor sit amet.
		Consectetur adipiscing elit.
	`
	_, err := GetWikiTextFirstSection(input)
	assert.Error(t, err, "should fail when no section delimiter found")
	assert.ErrorContains(t, err, "no section delimiter found in wikitext")
}

func TestGetWikiTextFirstSectionShouldPass(t *testing.T) {
	input := `
		== Lorem ipsum ==

		Lorem ipsum dolor sit amet.
		Consectetur adipiscing elit.
	`
	// Should preserve indentation
	expected := `
		`
	actual, err := GetWikiTextFirstSection(input)
	assert.NoError(t, err, "should pass")
	assert.Equal(t, expected, actual)
}

func TestGetWikiTextFirstSectionShouldPass2(t *testing.T) {
	input := `
		This is a paraghraph.

		== Lorem ipsum ==

		This shouldn't be included.
	`

	// Should preserve indentation
	expected := `
		This is a paraghraph.

		`

	actual, err := GetWikiTextFirstSection(input)
	assert.NoError(t, err, "should pass")
	assert.Equal(t, expected, actual)
}
