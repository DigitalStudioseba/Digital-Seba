$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174"
Invoke-WebRequest "$base/pdf.min.js" -OutFile (Join-Path $dir "pdf.min.js")
Invoke-WebRequest "$base/pdf.worker.min.js" -OutFile (Join-Path $dir "pdf.worker.min.js")
Write-Host "PDF.js 3.11.174 downloaded into vendor/."
