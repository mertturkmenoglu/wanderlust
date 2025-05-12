CREATE OR REPLACE VIEW profile AS
SELECT 
  id,
  username,
  full_name,
  is_business_account,
  is_verified,
  bio,
  pronouns,
  website,
  phone,
  profile_image,
  banner_image,
  followers_count,
  following_count,
  created_at
FROM users;
