#!/usr/bin/env python3
import os
import re
import sys
import json
import time
import shlex
import subprocess
from datetime import datetime
from typing import Optional, Tuple

REPO_URL_FALLBACK = "https://github.com/VGsaksham/Landlite.in.git"


def log(msg: str):
    print(f"[auto-sync] {msg}")


def run(cmd: str, check: bool = False) -> Tuple[int, str, str]:
    log(f"RUN: {cmd}")
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = proc.communicate()
    if check and proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {cmd}\n{err.strip()}")
    if out:
        log(f"OUT: {out.strip()}")
    if err:
        log(f"ERR: {err.strip()}")
    return proc.returncode, out.strip(), err.strip()


def ensure_git_available():
    code, _, _ = run("git --version")
    if code != 0:
        raise EnvironmentError("git is not installed or not on PATH. Install Git and try again.")


def get_repo_root() -> str:
    code, out, _ = run("git rev-parse --show-toplevel")
    if code != 0:
        raise RuntimeError("Not inside a git repository. Initialize git first.")
    return out


def get_remote_origin() -> Optional[str]:
    code, out, _ = run("git remote get-url origin")
    if code != 0:
        return None
    return out


def set_remote_origin(repo_url: str):
    origin = get_remote_origin()
    if origin is None:
        run(f"git remote add origin {shlex.quote(repo_url)}", check=True)
    else:
        if origin != repo_url:
            run(f"git remote set-url origin {shlex.quote(repo_url)}", check=True)


def current_branch() -> str:
    _, out, _ = run("git rev-parse --abbrev-ref HEAD", check=True)
    return out


def checkout(branch: str):
    run(f"git checkout {shlex.quote(branch)}", check=True)


def create_branch(branch: str):
    run(f"git checkout -b {shlex.quote(branch)}", check=True)


def any_changes() -> bool:
    code, out, _ = run("git status --porcelain=v1")
    return out.strip() != ""


def pull_rebase(default_branch: str = "main"):
    run(f"git fetch origin", check=True)
    for b in [default_branch, "master"]:
        code, _, _ = run(f"git rev-parse --verify {b}")
        if code == 0:
            checkout(b)
            run(f"git pull --rebase origin {b}", check=False)
            return b
    return default_branch


def ensure_git_identity():
    code_name, out_name, _ = run("git config user.name")
    code_email, out_email, _ = run("git config user.email")
    need = False
    if code_name != 0 or not out_name.strip():
        need = True
    if code_email != 0 or not out_email.strip():
        need = True
    if need:
        log("Setting local git identity: Landlite Auto Sync <auto-sync@local>")
        run("git config user.name \"Landlite Auto Sync\"", check=True)
        run("git config user.email \"auto-sync@local\"", check=True)


def push_branch(branch: str):
    run(f"git push -u origin {shlex.quote(branch)}", check=True)


def parse_owner_repo(remote_url: str) -> Optional[Tuple[str, str]]:
    https_match = re.match(r"https?://github.com/([^/]+)/([^/.]+)(?:\.git)?", remote_url)
    if https_match:
        return https_match.group(1), https_match.group(2)
    ssh_match = re.match(r"git@github.com:([^/]+)/([^/.]+)(?:\.git)?", remote_url)
    if ssh_match:
        return ssh_match.group(1), ssh_match.group(2)
    return None


def try_create_pr(owner: str, repo: str, head_branch: str, base_branch: str):
    code, _, _ = run("gh --version")
    title = f"Auto sync: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%SZ')}"
    body = "Automated sync commit(s) from local workspace."
    if code == 0:
        run(f"gh pr create --repo {owner}/{repo} --head {head_branch} --base {base_branch} --title \"{title}\" --body \"{body}\"", check=False)
        return

    token = os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN")
    if not token:
        log("No GH_TOKEN set and gh not found; skipping PR creation.")
        return

    import urllib.request
    api_url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
    data = json.dumps({
        "title": title,
        "head": head_branch,
        "base": base_branch,
        "body": body
    }).encode("utf-8")
    req = urllib.request.Request(api_url, data=data, method="POST")
    req.add_header("Authorization", f"token {token}")
    req.add_header("Accept", "application/vnd.github+json")
    try:
        with urllib.request.urlopen(req) as resp:
            _ = resp.read()
            log("PR created via API.")
    except Exception as e:
        log(f"PR creation via API failed: {e}")


def main():
    repo_url = sys.argv[1] if len(sys.argv) > 1 else REPO_URL_FALLBACK

    log("Starting auto sync")
    ensure_git_available()
    repo_root = get_repo_root()
    os.chdir(repo_root)
    log(f"Repo root: {repo_root}")

    set_remote_origin(repo_url)
    log(f"Remote origin ensured: {repo_url}")

    base_branch = pull_rebase("main")
    log(f"Pulled latest on base branch: {base_branch}")

    if not any_changes():
        log("No local changes detected; repository is up to date after pull.")
        return

    ensure_git_identity()

    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    work_branch = f"auto/sync-{timestamp}"

    create_branch(work_branch)
    run("git add -A", check=True)
    commit_msg = f"chore(auto-sync): update at {datetime.utcnow().isoformat()}Z"
    # Use double quotes for Windows cmd compatibility
    commit_arg = commit_msg.replace('"', '\\"')
    run(f"git commit -m \"{commit_arg}\"", check=True)

    push_branch(work_branch)

    origin = get_remote_origin() or repo_url
    owner_repo = parse_owner_repo(origin)
    if owner_repo:
        owner, repo = owner_repo
        try_create_pr(owner, repo, work_branch, base_branch)

    log(f"Pushed branch {work_branch}. If permissions allow, a PR has been created.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)
