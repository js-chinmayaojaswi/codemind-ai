# CodeMind AI — One-Click Hackathon Demo Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting CodeMind AI (FastAPI Backend + Vite Frontend) " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend
Write-Host "[1/2] Launching Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "backend\.venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -WorkingDirectory "backend" -PassThru

# 2. Start React / Vite Frontend
Write-Host "[2/2] Launching Frontend on http://localhost:5173..." -ForegroundColor Yellow
$frontendJob = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory "frontend" -PassThru

Start-Sleep -Seconds 3
Write-Host "CodeMind AI is LIVE!" -ForegroundColor Green
Write-Host "Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "FastAPI Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "Press Ctrl+C or close this window to terminate services." -ForegroundColor Gray
