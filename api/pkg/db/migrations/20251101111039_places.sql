-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,

  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  description TEXT NOT NULL,
  website VARCHAR(256),

  address_id INT NOT NULL,
  category_id SMALLINT NOT NULL,

  price_level SMALLINT NOT NULL CHECK(price_level >= 0),
  accessibility_level SMALLINT NOT NULL CHECK(accessibility_level >= 0),

  total_votes INT NOT NULL CHECK(total_votes >= 0),
  total_points INT NOT NULL CHECK(total_points >= 0),
  total_favorites INT NOT NULL CHECK(total_favorites >= 0),

  hours hstore NOT NULL,
  amenities hstore NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT
    fk_places_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_places_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_places_address ON places(address_id);

CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);

CREATE OR REPLACE TRIGGER update_places_timestamp BEFORE
UPDATE
  ON places FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE FUNCTION get_places(ids TEXT[])
RETURNS JSONB
AS $$
BEGIN
	RETURN (
    SELECT jsonb_agg(jsonb_build_object(
      'id', places.id,

      'name', places.name,
      'phone', places.phone,
      'description', places.description,
      'website', places.website,

      'addressId', places.address_id,
      'categoryId', places.category_id,

      'priceLevel', places.price_level,
      'accessibilityLevel', places.accessibility_level,

      'totalVotes', places.total_votes,
      'totalPoints', places.total_points,
      'totalFavorites', places.total_favorites,

      'hours', places.hours,
      'amenities', places.amenities,

      'createdAt', places.created_at,
      'updatedAt', places.updated_at,

      'address', jsonb_build_object(
        'id', addr.id,
        'cityId', addr.city_id,
        'line1', addr.line1,
        'line2', addr.line2,
        'postalCode', addr.postal_code,
        'lat', addr.lat,
        'lng', addr.lng,
        'city', jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'description', c.description,
          'state', jsonb_build_object(
            'code', c.state_code,
            'name', c.state_name
          ),
          'country', jsonb_build_object(
            'code', c.country_code,
            'name', c.country_name
          ),
          'image', c.image,
          'lat', c.lat,
          'lng', c.lng
        )
      ),
      'category', jsonb_build_object(
        'id', cat.id,
        'name', cat.name,
        'image', cat.image
      ),
      'assets', assets_agg.assets
    ))
    FROM public.places
    JOIN public.addresses addr ON places.address_id = addr.id
    JOIN public.cities c ON addr.city_id = c.id
    JOIN public.categories cat ON places.category_id = cat.id

    -- LATERAL join for images
    LEFT JOIN LATERAL (
      SELECT json_agg(jsonb_build_object(
        'id', a.id,

        'entity_type', a.entity_type,
        'entity_id', a.entity_id,

        'url', a.url,
        'asset_type', a.asset_type,
        'description', a.description,

        'created_at', a.created_at,
        'updated_at', a.updated_at,

        'order', a.order
      ) ORDER BY a.order) AS assets
      FROM public.assets a
      WHERE a.entity_id = places.id AND a.entity_type = 'place'
    ) assets_agg ON true

    WHERE places.id = ANY(ids)
  );
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS get_places(TEXT[]);

DROP TABLE IF EXISTS places;
-- +goose StatementEnd
