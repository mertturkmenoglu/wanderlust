# Ingest

## Ingest process

```mermaid
journey
  title Ingest Process
  section Admin Dashboard - Bounding Box
    Select Bounding Box: 5: User
    Download OSM Data: 5: User
    Rename file to XML: 5: User
    Move file to API tmp directory: 5: User
  section Reading OSM Data
    Use `pkg/osm` to Read OSM data: 5: API
    Filter Nodes: 5: API
    Filter Relations: 5: API
    Get Wikidata IDs: 5: API
```

```mermaid
journey
  title Using Wiki APIs
  section Use Wiki APIs to Get Information
    Use Wikidata API: 5: API
    Use Commons API to get images: 5: API
    Use Wikipedia API to get description: 5: API
    Save to file: 5: API
```
