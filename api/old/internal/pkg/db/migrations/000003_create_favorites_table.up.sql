CREATE TABLE IF NOT EXISTS favorites (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_favorites_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_poi ON favorites(poi_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_unique ON favorites(poi_id, user_id);

-- Triggers and functions
CREATE OR REPLACE FUNCTION inc_poi_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pois
    SET total_favorites = total_favorites + 1
  WHERE pois.id = NEW.poi_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dec_poi_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pois
    SET total_favorites = total_favorites - 1
  WHERE pois.id = OLD.poi_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inc_poi_favorites_count_trigger
  AFTER INSERT ON favorites
  FOR EACH ROW
  EXECUTE PROCEDURE inc_poi_favorites_count();

CREATE TRIGGER dec_poi_favorites_count_trigger
  AFTER DELETE ON favorites
  FOR EACH ROW
  EXECUTE PROCEDURE dec_poi_favorites_count();
