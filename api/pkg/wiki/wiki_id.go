package wiki

import "fmt"

type WikiID struct {
	value string
}

func NewWikiID(value string) (*WikiID, error) {
	if value == "" {
		return nil, fmt.Errorf("wiki id cannot be empty")
	}

	if value[0] != 'Q' {
		return nil, fmt.Errorf("wiki id must start with 'Q'")
	}

	return &WikiID{value: value}, nil
}

func (wikiId *WikiID) String() string {
	return wikiId.value
}
