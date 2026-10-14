CREATE TABLE "games" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"size" integer NOT NULL,
	"events" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"game_id" text NOT NULL,
	"name" text NOT NULL,
	"name_key" text NOT NULL,
	"grid" jsonb NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "players_game_id_name_key_index" ON "players" ("game_id","name_key");--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_game_id_games_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;