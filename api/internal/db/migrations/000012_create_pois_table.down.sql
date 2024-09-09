DROP TRIGGER IF EXISTS update_pois_timestamp ON pois;

DROP INDEX IF EXISTS idx_pois_category;

DROP INDEX IF EXISTS idx_pois_address;

DROP TABLE IF EXISTS pois;
