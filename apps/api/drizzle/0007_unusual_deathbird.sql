DROP INDEX IF EXISTS "users_username_idx";--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "lat" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "long" double precision NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");