-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS amenities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  CONSTRAINT
    idx_amenities_unique UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS amenities_pois (
  amenity_id INT NOT NULL,
  poi_id TEXT NOT NULL,
  CONSTRAINT
    fk_amenities_pois_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_amenities_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_amenities_pois_unique UNIQUE (amenity_id, poi_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS amenities_pois;

DROP TABLE IF EXISTS amenities;
-- +goose StatementEnd
