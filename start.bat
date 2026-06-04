@echo off
echo.
echo  ==========================================
echo   Estern Birds — Local Server
echo  ==========================================
echo.
echo  Homepage  : http://localhost:3000
echo  Birds page: http://localhost:3000/birds.html
echo.
echo  On WiFi/LAN open from any device:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
  set IP=%%a
  goto :found
)
:found
set IP=%IP: =%
echo  http://%IP%:3000
echo  http://%IP%:3000/birds.html
echo.
echo  Press Ctrl+C to stop the server.
echo.
serve "j:\Estern Birds\bird-website" -p 3000 --no-clipboard
pause
