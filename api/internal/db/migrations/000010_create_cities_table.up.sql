CREATE TABLE IF NOT EXISTS cities (
  id INT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  state_id INT NOT NULL,
  state_code VARCHAR(16) NOT NULL,
  country_id INT NOT NULL,
  country_code CHAR(2) NOT NULL,
  country_name VARCHAR(64) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  wiki_data_id VARCHAR(64) NOT NULL
);
