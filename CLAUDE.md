# CLAUDE.md

## Workflow

`/start`, `/finish` and `/release` run these steps; follow them for every task. `/drop` abandons a task (closes its PR, deletes its branch).

1. **Start**: a `feat/`, `fix/`, `refactor/`, `docs/` or `chore/` branch from `dev` (`hotfix/` from `main`, see Git), with a draft PR opened right away.
2. **Plan**: for non-trivial work (several files, a feature, a schema change, anything ambiguous), propose a plan and wait for approval.
3. **Implement**: small conventional commits. Stay on the task.
4. **Verify**: `npm run verify` (type check, lint and build). For UI changes, check the app in the browser, or say you couldn't.
5. **Self-review**: `/code-review` the diff and fix the findings that hold up.
6. **Finish**: update the PR's title and description and mark it ready. Never merge: the user reviews and merges.

**Be concise** in replies, PRs, commits and docs: lead with the answer, and only mention options you'd recommend.

**Side issues**: don't fix or stop to discuss unrelated problems you notice (bugs, tech debt, doc gaps). Log them in `BACKLOG.md`, which is local and git-ignored: edit it directly, never commit it (what, where, why, likely fix) and mention them in one line.

## Git

- Conventional commits. Never commit or push to `main` or `dev` directly, and never force-push.
- `main` is production, `dev` is staging and the default branch.
- Feature PRs target `dev` and are squash-merged.
- A release (`/release`) is a `dev` → `main` PR merged with a **merge commit**, never a squash, or the histories diverge and every later release conflicts.
- A hotfix is a `hotfix/…` branch from `main` with its PR into `main`, then a `main` → `dev` PR, also merged with a merge commit.
- PR titles and descriptions: concise, but with everything a reviewer needs (what, why, caveats, how to verify).

## Code

Principles (use judgment when one conflicts with clarity):

- **KISS** and **YAGNI**: the simplest thing that works for today's need, no speculative options or abstractions.
- **SRP**: one responsibility per function, component and module.
- **DRY**: don't duplicate knowledge. Extract on the third occurrence, and don't merge code that only looks alike.
- **Fail fast**: validate at boundaries and return errors early.
- **Least astonishment**: names and behavior match what a reader expects.

Conventions:

- Booleans start with a verb: `isOpen`, `hasImage`, `canDelete`.
- Early returns always use braces: `if (...) { return }`.
- Comments: JSDoc on exports, and inline only for what the code can't say (an edge case, a workaround, a why). Describe the code as it is, not its history: that goes in the commit. Rewrite, don't append.

Components:

- Server-first: pages, layouts and data fetching stay on the server. `'use client'` goes on the smallest interactive leaf; client components never fetch data.

Naming and layout:

- One PascalCase component per file; hooks are `useXxx.ts`.
- Colocate by feature: `components/<feature>/`, `lib/<feature>/`, `actions/<feature>/`, with types in `types.ts` and constants in `const.ts`.
- Prefix files shared by a feature with its name (`ItemCard`, `NewItemDialog`), but don't repeat the folder name otherwise. Short, explicit names.

Actions and forms:

- Every mutation is a `'use server'` action, validated with zod and consumed with `useActionState`.
- Actions return errors (with `errors`/`message` and echoed `values`) instead of throwing.
- Actions call `lib/<domain>`, never the database directly, and call `revalidatePath` for the pages they affect.

Styling:

- Tailwind only.
- Mobile-first: base styles for mobile, `sm:`/`md:` for larger screens.

## Next.js

@AGENTS.md
