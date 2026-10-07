---
name: finish
description: Finish the current bingo task (steps 4–6 of the CLAUDE.md workflow). Verifies, self-reviews, then updates the draft PR and marks it ready. Use when implementation is done and the user says finish, wrap up, ship it, ready for review, or types /finish.
---

# Finish a task

Stop and report at the first step that fails instead of papering over it. The user relies on "ready for review" meaning the checks actually passed.

## 1. Sanity check

- `git status`, `git branch --show-current`. You must be on a task branch, not `main` or `dev`.
- Commit any leftover work with conventional commits.
- Pick the base branch: `main` for a `hotfix/…` branch, `dev` for everything else. `<base>` below means that branch.
- `gh pr view`: `/start` opened a draft PR. If there's none (e.g. an older branch), step 4 creates it.

## 2. Verify

- `npm run verify`: type check, lint and build, stopping at the first failure (same as CI). Lint warnings don't fail it, but don't add new ones.
- If the change touches UI, run the app and check the change in the browser (the `run` skill or Chrome tools). If you can't, say so in the report instead of claiming it works.

Fix anything that fails, commit, and re-run.

## 3. Self-review

Size the review to the diff (`git diff --stat <base>...HEAD`):

- **Under ~150 changed lines**: skip `/simplify` (its parallel agents cost far more than such a diff needs). Read the diff yourself for reuse, simplification and dead code, then run `/code-review` once.
- **Larger**: run `/simplify` on the branch diff: keep the readability fixes that hold up (it applies them; revert any that change behavior or fight the conventions), commit, and re-verify. Then run `/code-review` on the diff.

Fix the findings that hold up, commit, and re-verify if code changed. Findings unrelated to this task go to `BACKLOG.md`, not into this PR.

## 4. Update the PR

Write the title and description from the final diff (`git diff <base>...HEAD`), not the original plan. Keep it concise but complete:

- **What** changed and **why** (a few bullets)
- **Caveats**: anything skipped, known limitations, follow-ups logged to `BACKLOG.md`
- **How to verify**: what you ran, plus what the reviewer should check by hand (on staging once merged into `dev`, if it needs a deployed app)

End the body with the attribution line from the system prompt, if there is one.

```bash
git push
gh pr edit --title "<type>: <summary>" --body "<description>"
gh pr ready
```

If the branch has no PR yet, `git push -u origin HEAD` then `gh pr create --base <base> --title ... --body ...` instead.

## 5. Report

A few lines: the PR link, what was verified and how, and anything the user should look at. Don't merge. The user reviews and merges (squash) into `dev`, tests it on staging, and ships it with `/release`. For a hotfix, remind them to open a `main` → `dev` PR afterwards and merge it with a merge commit.
