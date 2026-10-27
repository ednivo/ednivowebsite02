@echo off
echo ========================================================
echo Starting Ednivo Local Server at http://localhost:8000
echo ========================================================
echo Opening browser... Press Ctrl+C in this window to stop.
echo.
start http://localhost:8000
python -m http.server 8000
pause
