# OSM: Open Street Map

- OpenStreetMap (OSM) is an open-source project that provides geographic data.
- Definitive source of truth: https://wiki.openstreetmap.org/
- Some OSM concepts used in Wanderlust:
  - Element: OSM's basic data component.
  - Node: A point in space.
  - Relation: How other elements are related to each other.
  - Tag: Tags describe the meaning of the particular element to which they are attached.
- Overpass API: Read only OSM data service.

## Using OSM Data in Wanderlust

- Go to https://www.openstreetmap.org/export
- Move around the map to find the bounding box you want to download.
- Click on the `Overpass API` link on the left. (Respect Overpass API's usage policy, don't select a huge bounding box.)
- Clicking the link should start a download of the data in XML format. (You may add the file extension after you download it.)
- Use the `pkg/osm` package to read & parse the XML file.
  - Filter the nodes and relations. We want Wikidata IDs.
  - Get the Wikidata IDs of the nodes and relations.
  - Use `pkg/wiki`, `pkd/wiki/wikidata`, and `pkg/wiki/wikimedia` packages to get information about the POI.
  - Respect API usage policies.
  - Make sure you have `pandoc/extra` Docker image installed. (Otherwise it'll take a long time to download the image and job may fail.)
  - OSM data ingestion is still work in progress.
  - Read `pandoc.md` for more information.
