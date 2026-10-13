ALTER TABLE "players" DROP COLUMN "name";--> statement-breakpoint
CREATE INDEX "players_profile_id_index" ON "players" ("profile_id");