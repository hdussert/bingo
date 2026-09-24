---
name: drop
description: Abandon the current bingo task cleanly. Shows what would be lost, then closes its PR, deletes the branch (remote and local) and returns to dev. Use when the user wants to stop, drop, abandon or cancel the current task or its PR, or types /drop.
argument-hint: <why it's dropped (optional)>
---

# Drop a task

Reason: $ARGUMENTS

Deleting a branch with work that isn't on GitHub can't be undone, so nothing is deleted before the user confirms.

## 1. Show what would be lost

1. `git branch --show-current`. If it's `main` or `dev`, stop: there's no task to drop. `<base>` below is `dev` (`main` for a `hotfix/…` branch).
2. `git status --short`: uncommitted changes to tracked files will be discarded. Untracked files (`??`) are kept and stay in the working tree.
3. `git fetch -q`, then check whether the branch was ever pushed: `git rev-parse -q --verify origin/<branch>`.
   - Pushed: `git log --oneline origin/<branch>..HEAD` lists the commits that exist only here.
   - Never pushed: every commit on it exists only here (`git log --oneline <base>..HEAD`).
4. `gh pr view --json number,title,url,state`: the PR, if any. If it's `MERGED`, stop: the work shipped, there's nothing to drop (only offer to delete the leftover branches). If it's `CLOSED`, there's no PR to close: treat it like the no-PR case below.

Summarize it in a few lines: the branch, the PR, and what exists only on this machine (uncommitted changes, unpushed commits), which will be **lost for good**. Pushed commits stay reachable through the closed PR.

## 2. Confirm

Ask the user to confirm the drop. If part of the work is worth keeping as an idea, offer to log it in `BACKLOG.md`. If there's no reason in `$ARGUMENTS`, ask for one line to put on the PR.

Stop here unless the user confirms.

## 3. Drop

Leave the branch first, so nothing below runs while it's checked out. `--discard-changes` drops the uncommitted changes the user agreed to lose; untracked files come along untouched.

```bash
git switch --discard-changes dev && git pull
```

With an open PR, closing it with `--delete-branch` also deletes the branch, both on GitHub and locally:

```bash
gh pr close <number> --comment "Dropped: <reason>" --delete-branch
```

Without an open PR, delete the branch yourself: `git branch -D <branch>`, plus `git push origin --delete <branch>` if it was pushed.

## 4. Report

One or two lines: the closed PR's link, that the branch is gone (remote and local), and that the PR can be reopened and its branch restored from GitHub if needed. If an idea was worth keeping, add it to `BACKLOG.md` directly (it's local, not committed) and say so.
