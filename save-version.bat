@echo off
echo.
echo  === Estern Birds — Save Version ===
echo.
set /p MSG=Describe what you changed: 
if "%MSG%"=="" set MSG=update
git -C "j:\Estern Birds\bird-website" add -A
git -C "j:\Estern Birds\bird-website" commit -m "%MSG%"
echo.
echo  Saved. Run versions.bat to see history.
echo.
pause
