CREATE INDEX IF NOT EXISTS "events_organizer_idx" ON "events" ("organizer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_location_idx" ON "events" ("location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locations_country_idx" ON "locations" ("country");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locations_city_idx" ON "locations" ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "points_location_idx" ON "points" ("location_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "points_category_idx" ON "points" ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");