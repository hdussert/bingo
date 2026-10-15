# Bingo!

> [!WARNING]
> **This project was mostly vibe coded, and that is not how I usually work.**
>
> Nearly all of the code was written by an AI agent (Claude Code), which co-authored all but two of the commits on `dev`. My part was everything around the code:
>
> - **I set up the workflow it had to follow** ([CLAUDE.md](CLAUDE.md) and the `/start`, `/finish` and `/release` skills): a branch and a draft PR per task, small conventional commits, type check, lint and build before every PR, a self-review sized to the diff, and staging before production.
> - **I made the product and design decisions**: what to build and in what order, and how each screen should look and feel. I reviewed every screen on the way.
> - **I tested it and caught what went wrong**, including bugs that only showed in production, and pushed back when the agent made things up.
> - **I reviewed and merged every PR.**
>
> I looked at the code, but I didn't micromanage the implementation. It was a small app with a deadline, built for a party. On a real project I read, shape and own every line, and I wouldn't ship code I haven't reviewed that closely.

A bingo you play with friends on your phones. Guess what will happen at a party, a trip or any get-together, then tick it off when it does. The first to complete a line wins.

## How it works

- **Create a game:** give it a title, pick a 3×3, 4×4 or 5×5 grid, and list what might happen. With more events than the grid needs, every player gets a different mix.
- **Invite:** share the link. Chat apps show a preview card for it. A game can be private, behind a password.
- **Play:** each player gets their own shuffled grid and ticks events as they happen. A full line, column or diagonal is a bingo, with confetti.
- **Follow along:** a leaderboard ranks players by their bingos and progress. You can peek at the other players' grids.
- **No accounts:** a phone remembers its player. To play on another phone, use the player's code from the profile page.
- **Organizers** can rename the game, change its password, remove players and end it.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, server actions)
- [Tailwind CSS](https://tailwindcss.com) v4 and [shadcn/ui](https://ui.shadcn.com) on Base UI
- [Neon](https://neon.tech) Postgres with [Drizzle ORM](https://orm.drizzle.team)
- Hosted on [Vercel](https://vercel.com)

## Run it locally

You need Node.js and a Postgres database (a free Neon database works).

```bash
npm install
echo 'DATABASE_URL=postgres://…' > .env.local
npm run db:migrate
npm run dev
```

Then open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run verify` | Type check, lint and build, as CI does |
| `npm run db:generate` | Creates a migration from changes to `db/schema.ts` |
| `npm run db:migrate` | Applies pending migrations to the `.env.local` database |
| `npm run db:studio` | Opens Drizzle Studio on that database |

## Branches and deploys

- **`dev`** is staging, and the base for every feature branch. PRs into it are squash-merged.
- **`main`** is production. A release is a `dev` → `main` PR, merged with a merge commit.
- **Vercel** deploys both branches. Each deploy applies its database's pending migrations before building (`scripts/vercel-build.sh`).
