-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION get_pois(ids TEXT[])
RETURNS JSONB
AS $$
BEGIN
	RETURN (
    SELECT jsonb_agg(jsonb_build_object(
      'id', pois.id,
      'name', pois.name,
      'description', pois.description,
      'phone', pois.phone,
      'addressId', pois.address_id,
      'website', pois.website,
      'priceLevel', pois.price_level,
      'accessibilityLevel', pois.accessibility_level,
      'totalVotes', pois.total_votes,
      'totalPoints', pois.total_points,
      'totalFavorites', pois.total_favorites,
      'categoryId', pois.category_id,
      'hours', pois.hours,
      'createdAt', pois.created_at,
      'updatedAt', pois.updated_at,
      'address', jsonb_build_object(
        'id', addr.id,
        'cityId', addr.city_id,
        'line1', addr.line1,
        'line2', addr.line2,
        'postalCode', addr.postal_code,
        'lat', addr.lat,
        'lng', addr.lng
      ),
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
        'latitude', c.latitude,
        'longitude', c.longitude
      ),
      'category', jsonb_build_object(
        'id', cat.id,
        'name', cat.name,
        'image', cat.image
      ),
      'media', media_agg.media,
      'amenities', amenities_agg.amenities
    ))
    FROM public.pois
    JOIN public.addresses addr ON pois.address_id = addr.id
    JOIN public.cities c ON addr.city_id = c.id
    JOIN public.categories cat ON pois.category_id = cat.id

    -- LATERAL join for media
    LEFT JOIN LATERAL (
      SELECT json_agg(jsonb_build_object(
        'id', m.id,
        'url', m.url,
        'index', m.index
      ) ORDER BY m.index) AS media
      FROM public.media m
      WHERE m.poi_id = pois.id
    ) media_agg ON true

    -- LATERAL join for amenities
    LEFT JOIN LATERAL (
      SELECT json_agg(jsonb_build_object(
        'id', a.id,
        'name', a.name
      )) AS amenities
      FROM public.amenities_pois ap
      JOIN public.amenities a ON ap.amenity_id = a.id
      WHERE ap.poi_id = pois.id
    ) amenities_agg ON true

    WHERE pois.id = ANY(ids)
  );
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS get_pois(TEXT[]);
-- +goose StatementEnd
