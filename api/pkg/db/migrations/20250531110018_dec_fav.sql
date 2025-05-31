-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION dec_poi_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pois
    SET total_favorites = total_favorites - 1
  WHERE pois.id = OLD.poi_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS dec_poi_favorites_count;
-- +goose StatementEnd
