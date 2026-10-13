CREATE TABLE "profiles" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"token_hash" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "profile_id" text;--> statement-breakpoint
-- Players from before profiles each get one that no phone holds (its token is random and thrown away)
UPDATE "players" SET "profile_id" = gen_random_uuid()::text;--> statement-breakpoint
INSERT INTO "profiles" ("id", "name", "token_hash") SELECT "profile_id", "name", encode(sha256(gen_random_uuid()::text::bytea), 'hex') FROM "players";--> statement-breakpoint
ALTER TABLE "players" DROP CONSTRAINT "players_pkey";--> statement-breakpoint
ALTER TABLE "players" ADD PRIMARY KEY ("game_id","profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "players_game_id_name_key_index" ON "players" ("game_id","name_key");--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;