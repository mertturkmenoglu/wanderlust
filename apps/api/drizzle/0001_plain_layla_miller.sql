CREATE TABLE IF NOT EXISTS "auths" (
	"id" uuid PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text,
	"email_id" text,
	"email_verification" text,
	"last_sign_in_at" integer,
	"created_at" integer,
	"updated_at" integer,
	"username" text,
	"image" text,
	"user_id" uuid,
	CONSTRAINT "auths_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
