package osm

import "testing"

func TestTagWeight(t *testing.T) {
	tests := []struct {
		name     string
		tag      Tag
		expected int
	}{
		{
			name:     "Name Should Have Weight 1",
			tag:      Tag{K: "name", V: "Lorem ipsum"},
			expected: 1,
		},
		{
			name:     "Wikidata ID Should Have Weight 1",
			tag:      Tag{K: "wikidata", V: "Q123456"},
			expected: 1,
		},
		{
			name:     "Public Transport Stop Position Should Have Weight -1",
			tag:      Tag{K: "public_transport", V: "stop_position"},
			expected: -1,
		},
		{
			name:     "Public Transport With Different Value Should Have Weight 0",
			tag:      Tag{K: "public_transport", V: "__SOMETHING_ELSE__"},
			expected: 0,
		},
		{
			name:     "Place Neighbourhood Should Have Weight -1",
			tag:      Tag{K: "place", V: "neighbourhood"},
			expected: -1,
		},
		{
			name:     "Place With Different Value Should Have Weight 0",
			tag:      Tag{K: "place", V: "__SOMETHING_ELSE__"},
			expected: 0,
		},
		{
			name:     "Railway Should Have Weight -1",
			tag:      Tag{K: "railway", V: "yes"},
			expected: -1,
		},
		{
			name:     "Other Tag Should Have Weight 0",
			tag:      Tag{K: "__OTHER_TAG_KEY__", V: "__OTHER_TAG_VALUE__"},
			expected: 0,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			actual := getTagWeight(test.tag)
			if actual != test.expected {
				t.Errorf("expected %d, got %d", test.expected, actual)
			}
		})
	}

}

func TestIsNodeValid(t *testing.T) {
	tests := []struct {
		name     string
		node     Node
		expected bool
	}{
		{
			name: "Empty Tags Node Should Not Be Valid",
			node: Node{
				Tags: nil,
			},
			expected: false,
		},
		{
			name: "Node with Tag Weight 1 Should Not Be Valid",
			node: Node{
				Tags: []Tag{
					{K: "name", V: "Lorem ipsum"},
				},
			},
			expected: false,
		},
		{
			name: "Node with Tag Weight 2 Should Be Valid",
			node: Node{
				Tags: []Tag{
					{K: "name", V: "Lorem ipsum"},
					{K: "wikidata", V: "Q123456"},
				},
			},
			expected: true,
		},
		{
			name: "Invalid Node",
			node: Node{
				Tags: []Tag{
					{K: "name", V: "Lorem ipsum"},
					{K: "wikidata", V: "Q123456"},
					{K: "public_transport", V: "stop_position"},
					{K: "place", V: "neighbourhood"},
					{K: "__OTHER_TAG_KEY__", V: "__OTHER_TAG_VALUE__"},
				},
			},
			expected: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			actual := isNodeValid(test.node)
			if actual != test.expected {
				t.Errorf("expected %t, got %t", test.expected, actual)
			}
		})
	}
}

func TestIsRelationValid(t *testing.T) {
	tests := []struct {
		name     string
		relation Relation
		expected bool
	}{
		{
			name: "Empty Tags Relation Should Not Be Valid",
			relation: Relation{
				Tags: nil,
			},
			expected: false,
		},
		{
			name: "Relation with Tag Weight 1 Should Not Be Valid",
			relation: Relation{
				Tags: []Tag{
					{K: "name", V: "Lorem ipsum"},
				},
			},
			expected: false,
		},
		{
			name: "Relation with Tag Weight 2 Should Be Valid",
			relation: Relation{
				Tags: []Tag{
					{K: "name", V: "Lorem ipsum"},
					{K: "wikidata", V: "Q123456"},
				},
			},
			expected: true,
		},
		{
			name: "Invalid Relation",
			relation: Relation{
				Tags: []Tag{
					{K: "type", V: "restriction"},
					{K: "restriction", V: "no_left_turn"},
					{K: "public_transport", V: "stop_position"},
					{K: "place", V: "neighbourhood"},
					{K: "__OTHER_TAG_KEY__", V: "__OTHER_TAG_VALUE__"},
				},
			},
			expected: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			actual := isRelationValid(test.relation)
			if actual != test.expected {
				t.Errorf("expected %t, got %t", test.expected, actual)
			}
		})
	}
}
