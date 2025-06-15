package osm

func (osmData *Data) FilterNodes() {
	outNodes := make([]Node, 0)

	for _, node := range osmData.Nodes {
		if isNodeValid(node) {
			outNodes = append(outNodes, node)
		}
	}

	osmData.Nodes = outNodes
}

func (osmData *Data) FilterRelations() {
	outRelations := make([]Relation, 0)

	for _, relation := range osmData.Relations {
		if isRelationValid(relation) {
			outRelations = append(outRelations, relation)
		}
	}

	osmData.Relations = outRelations
}

func getTagWeight(tag Tag) int {
	switch tag.K {
	case "name":
		return 1
	case "wikidata":
		return 1
	case "public_transport":
		if tag.V == "stop_position" {
			return -1
		}
		return 0
	case "place":
		if tag.V == "neighbourhood" {
			return -1
		}
		return 0
	case "railway":
		return -1
	default:
		return 0
	}
}

func isNodeValid(node Node) bool {
	if len(node.Tags) == 0 {
		return false
	}
	w := 0
	for _, tag := range node.Tags {
		w += getTagWeight(tag)
	}
	return w == 2
}

func isRelationValid(relation Relation) bool {
	if len(relation.Tags) == 0 {
		return false
	}
	w := 0
	for _, tag := range relation.Tags {
		w += getTagWeight(tag)
	}
	return w == 2
}
