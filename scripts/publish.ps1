<#
Publishes the monorepo subtrees to the two GitHub repositories that back the Vercel projects.

  server/  ->  CampusCoin        (API,    campus-coin-omega.vercel.app)
  client/  ->  CampusCoin-client (client, campus-coin-client.vercel.app)

Each remote receives its subtree as the repository root, which is what both Vercel
projects expect (Root Directory "/"). History is preserved with `git subtree split`,
so this is safe to run repeatedly.

    .\scripts\publish.ps1                 # both, normal push
    .\scripts\publish.ps1 -Target client  # only the client
    .\scripts\publish.ps1 -Force          # overwrite remote history (first run only)
#>
[CmdletBinding()]
param(
  [ValidateSet('client', 'server', 'all')]
  [string]$Target = 'all',
  [string]$Branch = 'main',
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$targets = if ($Target -eq 'all') { @('server', 'client') } else { @($Target) }

foreach ($name in $targets) {
  if (-not (Test-Path $name)) { throw "No '$name' directory in $root" }

  $splitBranch = "publish-$name"
  Write-Host "==> splitting $name/" -ForegroundColor Cyan
  git subtree split --prefix="$name" -b $splitBranch | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "subtree split failed for $name" }

  Write-Host "==> pushing $name/ to remote '$name' as $Branch" -ForegroundColor Cyan
  if ($Force) {
    git push --force $name "${splitBranch}:refs/heads/$Branch"
  }
  else {
    git push $name "${splitBranch}:refs/heads/$Branch"
  }
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Push of $name failed. First run against an existing repository? Re-run with -Force."
  }
}
