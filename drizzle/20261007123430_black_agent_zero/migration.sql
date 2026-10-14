DROP INDEX "players_game_id_name_key_index";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "players" ADD PRIMARY KEY ("game_id","name_key");