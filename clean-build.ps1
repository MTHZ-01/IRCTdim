# Clean Build Script for Electron App
Write-Host "Cleaning up processes and build artifacts..." -ForegroundColor Yellow

# Kill any running Electron or Node processes
Write-Host "Stopping Electron and Node processes..." -ForegroundColor Cyan
Get-Process | Where-Object {$_.ProcessName -like "*electron*" -or $_.ProcessName -like "*knoladge*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Remove build directories
Write-Host "Removing build directories..." -ForegroundColor Cyan
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".\out"
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".\.webpack"

# Wait a moment for file system to catch up
Start-Sleep -Seconds 1

Write-Host "Cleanup complete! You can now run 'npm run build' safely." -ForegroundColor Green