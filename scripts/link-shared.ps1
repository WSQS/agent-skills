# Recreate skill-local junctions to repo-root shared/ (Windows).
# Run from repo root after clone. Do not commit the junction dirs.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$root\shared")) {
  $root = (Get-Location).Path
}

function Set-Junction([string]$Link, [string]$Target) {
  if (-not (Test-Path $Target)) { throw "missing target: $Target" }
  $parent = Split-Path -Parent $Link
  if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  if (Test-Path $Link) {
    cmd /c "rmdir `"$Link`""
    if ($LASTEXITCODE -ne 0) { throw "failed to remove $Link" }
  }
  cmd /c "mklink /J `"$Link`" `"$Target`""
  if ($LASTEXITCODE -ne 0) { throw "failed to link $Link" }
  Write-Host "linked $Link -> $Target"
}

$shared = Join-Path $root "shared"
foreach ($skill in @("on-write", "on-submit", "write-skill")) {
  Set-Junction (Join-Path $root "skills\$skill\shared") $shared
}
