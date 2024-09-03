-- Trigger to update the updated_at field automatically
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = NOW(); 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;