@echo off
echo Starting IDOL-LOG Server...
start "IDOL-LOG Server" cmd /k "cd server && node index.js"

echo Starting IDOL-LOG Client...
start "IDOL-LOG Client" cmd /k "cd client && npm run dev"

echo.
echo Please wait for both windows to start.
echo Then open: http://localhost:5173
pause
