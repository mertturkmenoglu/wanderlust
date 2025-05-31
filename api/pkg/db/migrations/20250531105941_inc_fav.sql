-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION inc_poi_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pois
    SET total_favorites = total_favorites + 1
  WHERE pois.id = NEW.poi_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS inc_poi_favorites_count;
-- +goose StatementEnd
