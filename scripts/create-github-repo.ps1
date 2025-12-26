param(
  [string]$RepoName
)

# Helper script to create a GitHub repo using GitHub CLI and push the current repo to it.
# Usage: .\scripts\create-github-repo.ps1 -RepoName my-vexlo

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "gh (GitHub CLI) is not installed."
  Write-Host "Install it: https://cli.github.com/"
  Write-Host "Or follow the manual instructions in the README: create a repo on GitHub and run:`n  git remote add origin https://github.com/<your-username>/$RepoName.git`n  git push -u origin main"
  exit 1
}

if (-not $RepoName) {
  $RepoName = Split-Path -Leaf (Get-Location)
}

$confirm = Read-Host "Create GitHub repo named '$RepoName'? (Y/n)"
if ($confirm -and $confirm -match '^[Nn]') {
  Write-Host 'Aborted by user.'
  exit 0
}

# Create repo (public by default)
gh repo create $RepoName --public --source=. --remote=origin --push

$login = (gh api user --jq '.login')
Write-Host "Repository created and pushed to origin: https://github.com/$login/$RepoName"