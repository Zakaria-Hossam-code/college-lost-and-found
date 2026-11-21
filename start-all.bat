@echo off
echo ========================================================
echo  Starting College Lost ^& Found Management System
echo ========================================================
start "CampusFind Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && dotnet run --urls http://localhost:5000"
timeout /t 4 /nobreak >nul
start "CampusFind Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:5173
echo.
echo Application started in separate windows!
