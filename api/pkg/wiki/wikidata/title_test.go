package wikidata

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetTitleFromUrlShouldPass(t *testing.T) {
	input := "https://en.wikipedia.org/wiki/Lorem_ipsum"
	expected := "Lorem_ipsum"
	actual, err := getTitleFromUrl(input)
	assert.NoError(t, err, "should pass")
	assert.Equal(t, expected, actual)
}

func TestGetTitleFromUrlShouldFailWhenUrlDoesNotContainWiki(t *testing.T) {
	input := "https://en.wikipedia.org/Lorem_ipsum"
	_, err := getTitleFromUrl(input)
	assert.Error(t, err, "should fail when url does not contain 'wiki/'")
	assert.ErrorContains(t, err, "url does not contain 'wiki/'")
}

func TestGetTitleShouldPass(t *testing.T) {
	res := &Response{
		Entities: map[string]Entity{
			"Q123456": {
				SiteLinks: map[string]SiteLink{
					"enwiki": {
						Url: "https://en.wikipedia.org/wiki/Lorem_ipsum",
					},
				},
			},
		},
	}
	wdc := NewWikidataClient(WithAlternativeLanguage("es"))
	actual, actual2, err := wdc.GetTitle(res)
	assert.NoError(t, err, "should pass")
	assert.Equal(t, "en", actual)
	assert.Equal(t, "Lorem_ipsum", actual2)
}

func TestGetTitleShouldPassWhenNoDefaultSiteLinkFound(t *testing.T) {
	res := &Response{
		Entities: map[string]Entity{
			"Q123456": {
				SiteLinks: map[string]SiteLink{
					"eswiki": {
						Url: "https://es.wikipedia.org/wiki/Lorem_ipsum",
					},
				},
			},
		},
	}
	wdc := NewWikidataClient(WithAlternativeLanguage("es"))
	actual, actual2, err := wdc.GetTitle(res)
	assert.NoError(t, err, "should pass")
	assert.Equal(t, "es", actual)
	assert.Equal(t, "Lorem_ipsum", actual2)
}
