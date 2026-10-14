ALTER TABLE "games" ADD COLUMN "creator_id" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_creator_id_profiles_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "profiles"("id") ON DELETE SET NULL;