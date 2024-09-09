CREATE TABLE IF NOT EXISTS states (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  country_id INT NOT NULL,
  country_code CHAR(2) NOT NULL,
  country_name VARCHAR(64) NOT NULL,
  state_code VARCHAR(16) NOT NULL,
  type VARCHAR(16),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);
