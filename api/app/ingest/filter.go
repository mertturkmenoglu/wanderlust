package ingest

func filterNodes(inNodes []OsmNode) []OsmNode {
	outNodes := make([]OsmNode, 0)

	for _, node := range inNodes {
		if len(node.Tags) == 0 {
			continue
		}

		flag := 0

		for _, tag := range node.Tags {
			if tag.K == "name" {
				flag++
			}

			if tag.K == "wikidata" {
				flag++
			}

			if tag.K == "public_transport" && tag.V == "stop_position" {
				flag--
			}

			if tag.K == "place" && tag.V == "neighbourhood" {
				flag--
			}

			if tag.K == "railway" {
				flag--
			}
		}

		if flag != 2 {
			continue
		}

		outNodes = append(outNodes, node)
	}

	return outNodes
}

func filterRelations(inRelations []OsmRelation) []OsmRelation {
	outRelations := make([]OsmRelation, 0)

	for _, relation := range inRelations {
		if len(relation.Tags) == 0 {
			continue
		}

		flag := 0

		for _, tag := range relation.Tags {
			if tag.K == "name" {
				flag++
			}

			if tag.K == "wikidata" {
				flag++
			}

			if tag.K == "public_transport" && tag.V == "stop_position" {
				flag--
			}

			if tag.K == "place" && tag.V == "neighbourhood" {
				flag--
			}

			if tag.K == "railway" {
				flag--
			}
		}

		if flag != 2 {
			continue
		}

		outRelations = append(outRelations, relation)
	}

	return outRelations
}
