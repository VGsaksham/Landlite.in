#!/usr/bin/env python3
"""
Git sync helper for Landlite.in

- Stages all changes
- Creates a helpful commit message if none provided
- Pulls latest from remote with rebase
- Pushes to remote (default: main)

Usage:
  python scripts/git_sync.py --message "feat: update content"
  python scripts/git_sync.py --remote origin --branch main
  python scripts/git_sync.py --set-origin

Notes:
- Defaults remote to "origin" and branch to "main" unless overridden.
- If --set-origin is provided, origin URL will be set to the Landlite repo URL.
"""

from __future__ import annotations
import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path

LANDLITE_REPO_URL = "https://github.com/VGsaksham/Landlite.in.git"


def run(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)


def run_check(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess:
    cp = run(cmd, cwd)
    if cp.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\nSTDOUT:\n{cp.stdout}\nSTDERR:\n{cp.stderr}")
    return cp


def ensure_git_available() -> None:
    try:
        subprocess.run(["git", "--version"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        print("ERROR: Git does not seem to be installed or available in PATH.")
        sys.exit(1)


def find_repo_root(start: Path) -> Path:
    current = start
    while current != current.parent:
        if (current / ".git").exists():
            return current
        current = current.parent
    print("ERROR: Could not find a .git directory up the tree from", start)
    sys.exit(1)


def get_remote_url(remote: str, repo_root: Path) -> str | None:
    cp = run(["git", "remote", "get-url", remote], repo_root)
    return cp.stdout.strip() if cp.returncode == 0 else None


def set_remote_url(remote: str, url: str, repo_root: Path) -> None:
    existing = get_remote_url(remote, repo_root)
    if existing is None:
        run_check(["git", "remote", "add", remote, url], repo_root)
    elif existing != url:
        run_check(["git", "remote", "set-url", remote, url], repo_root)


def has_staged_or_unstaged_changes(repo_root: Path) -> bool:
    cp = run_check(["git", "status", "--porcelain"], repo_root)
    return cp.stdout.strip() != ""


def has_commits_to_push(remote: str, branch: str, repo_root: Path) -> bool:
    # Fetch first to compare
    run_check(["git", "fetch", remote, branch], repo_root)
    cp = run(["git", "rev-list", "--left-right", "--count", f"{remote}/{branch}...HEAD"], repo_root)
    if cp.returncode != 0:
        return True
    parts = cp.stdout.strip().split()
    if len(parts) != 2:
        return True
    behind, ahead = map(int, parts)
    return ahead > 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Stage, commit, pull --rebase, and push changes.")
    parser.add_argument("--message", "-m", help="Commit message. If not set, a timestamped message is generated.")
    parser.add_argument("--remote", default="origin", help="Remote name (default: origin)")
    parser.add_argument("--branch", default="main", help="Branch name to pull/push (default: main)")
    parser.add_argument("--set-origin", action="store_true", help="Ensure origin is set to the Landlite repo URL.")
    args = parser.parse_args()

    ensure_git_available()

    # Ensure we run from repository root
    script_path = Path(__file__).resolve()
    repo_root = find_repo_root(script_path.parent)

    remote = args.remote
    branch = args.branch

    if args.set_origin:
        set_remote_url(remote, LANDLITE_REPO_URL, repo_root)

    # Warn if remote URL differs from expected
    remote_url = get_remote_url(remote, repo_root)
    if remote == "origin" and remote_url and remote_url != LANDLITE_REPO_URL:
        print(f"NOTE: origin currently points to {remote_url}")
        print(f"      To set it to {LANDLITE_REPO_URL}, re-run with --set-origin")

    # Stage changes
    run_check(["git", "add", "-A"], repo_root)

    if has_staged_or_unstaged_changes(repo_root):
        commit_message = args.message or f"chore: sync changes {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        cp = run(["git", "commit", "-m", commit_message], repo_root)
        if cp.returncode != 0:
            print(cp.stdout or cp.stderr)
    else:
        print("No changes to commit.")

    # Pull latest main with rebase to keep history linear
    print(f"Rebasing current HEAD onto {remote}/{branch}...")
    cp = run(["git", "pull", "--rebase", remote, branch], repo_root)
    if cp.returncode != 0:
        print(cp.stdout)
        print(cp.stderr)
        print("ERROR: Rebase failed. Resolve conflicts, then run:\n  git rebase --continue\nOr abort with:\n  git rebase --abort")
        return 1

    # Push HEAD to the specified remote branch
    print(f"Pushing HEAD to {remote}/{branch}...")
    cp_push = run(["git", "push", remote, f"HEAD:{branch}"], repo_root)
    if cp_push.returncode != 0:
        print(cp_push.stdout)
        print(cp_push.stderr)
        print("ERROR: Push failed. If the remote branch is protected, you may need to merge via PR.")
        if not has_commits_to_push(remote, branch, repo_root):
            print("Nothing to push.")
            return 0
        return 1

    print(f"Pushed to {remote}/{branch} successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
