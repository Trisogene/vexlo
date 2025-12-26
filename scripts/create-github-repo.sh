#!/usr/bin/env bash
set -euo pipefail

# Helper script to create a GitHub repo using GitHub CLI and push the current repo to it.
# Usage: ./scripts/create-github-repo.sh [repo-name]

DEFAULT_NAME="$(basename "$PWD")"
REPO_NAME="${1:-$DEFAULT_NAME}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh (GitHub CLI) is not installed."
  echo "Install it: https://cli.github.com/"
  echo "Or follow the manual instructions in README: create a repo on GitHub and run:"
  echo "  git remote add origin https://github.com/<your-username>/$REPO_NAME.git"
  echo "  git push -u origin main"
  exit 1
fi

read -p "Create GitHub repo named '$REPO_NAME'? (Y/n) " confirm
confirm=${confirm:-Y}
if [[ "$confirm" =~ ^[Nn] ]]; then
  echo "Aborted by user."
  exit 0
fi

# Create repo (public by default)
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo "Repository created and pushed to origin: https://github.com/$(gh api user --jq '.login')/$REPO_NAME"