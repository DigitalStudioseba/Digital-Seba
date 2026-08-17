@echo off
cd /d "%~dp0"
where powershell >nul 2>nul || (echo Windows PowerShell is required.&pause&exit /b 1)
where npx >nul 2>nul || (echo Please install Node.js first.&pause&exit /b 1)
if not exist "vendor\download-pdfjs.ps1" (echo Missing vendor\download-pdfjs.ps1&pause&exit /b 1)
if not exist "vendor\pdf.min.js" powershell -ExecutionPolicy Bypass -File ".\vendor\download-pdfjs.ps1"
if not exist "vendor\pdf.worker.min.js" powershell -ExecutionPolicy Bypass -File ".\vendor\download-pdfjs.ps1"
echo.
echo VoteSondhan local server starting...
echo Open: http://127.0.0.1:9095/
echo.
npx http-server . -p 9095 -c-1
pause
