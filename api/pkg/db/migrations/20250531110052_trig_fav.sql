-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER inc_poi_favorites_count_trigger
  AFTER INSERT ON favorites
  FOR EACH ROW
  EXECUTE PROCEDURE inc_poi_favorites_count();

CREATE TRIGGER dec_poi_favorites_count_trigger
  AFTER DELETE ON favorites
  FOR EACH ROW
  EXECUTE PROCEDURE dec_poi_favorites_count();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS dec_poi_favorites_count_trigger ON favorites;

DROP TRIGGER IF EXISTS inc_poi_favorites_count_trigger ON favorites;
-- +goose StatementEnd
