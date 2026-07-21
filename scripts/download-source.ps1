$ErrorActionPreference = "Stop"
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$zipPath = Join-Path $baseDir "kelasku-source.zip"
$exclude = @("node_modules", ".git", "dist", ".kilo", "kelasku-source.zip")

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath
}

$items = Get-ChildItem -LiteralPath $baseDir -Force | Where-Object {
    $name = $_.Name
    $exclude -notcontains $name
}

$tempDir = Join-Path $baseDir ".temp-zip-src"
if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($item in $items) {
    Copy-Item -LiteralPath $item.FullName -Destination (Join-Path $tempDir $item.Name) -Recurse -Force
}

Compress-Archive -LiteralPath (Join-Path $tempDir "*") -DestinationPath $zipPath -Force
Remove-Item -LiteralPath $tempDir -Recurse -Force
Write-Host "Source code berhasil dibuat: $zipPath"
