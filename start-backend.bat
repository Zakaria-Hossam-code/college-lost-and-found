@echo off
echo Starting College Lost ^& Found Backend API on http://localhost:5000...
cd /d "%~dp0backend"
dotnet run --urls http://localhost:5000
pause
