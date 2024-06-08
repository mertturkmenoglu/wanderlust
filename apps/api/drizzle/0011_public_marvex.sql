ALTER TABLE "list_items" DROP CONSTRAINT "list_items_location_id_locations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "list_items" ADD CONSTRAINT "list_items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
