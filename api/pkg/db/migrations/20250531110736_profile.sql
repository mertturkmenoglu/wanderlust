-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE VIEW profile AS
SELECT 
  id,
  username,
  full_name,
  is_verified,
  bio,
  pronouns,
  website,
  profile_image,
  banner_image,
  followers_count,
  following_count,
  created_at
FROM users;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS profile;
-- +goose StatementEnd
