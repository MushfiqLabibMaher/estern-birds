@echo off
echo.
echo  ==========================================
echo   Estern Birds — Save Version
echo  ==========================================
echo.

set /p VER=Enter version number (e.g. 3.1, 4.0): 
if "%VER%"=="" set VER=0.0

set /p MSG=What did you change? (short description): 
if "%MSG%"=="" set MSG=update

rem --- Get today's date ---
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set DT=%%I
set YYYY=%DT:~0,4%
set MM=%DT:~4,2%
set DD=%DT:~6,2%
set TODAY=%YYYY%-%MM%-%DD%

rem --- Update APP_VERSION in .env.local ---
powershell -Command "(Get-Content 'j:\Estern Birds\bird-website\.env.local') -replace '^APP_VERSION=.*', 'APP_VERSION=%VER%' | Set-Content 'j:\Estern Birds\bird-website\.env.local'"

rem --- Prepend new entry to CHANGELOG.md ---
set ENTRY=## v%VER% — %TODAY%\n- %MSG%\n
powershell -Command "$new = \"## v%VER% — %TODAY%`n- %MSG%`n\"; $old = Get-Content 'j:\Estern Birds\bird-website\CHANGELOG.md' -Raw; $marker = '---'; $pos = $old.IndexOf($marker); $updated = $old.Substring(0,$pos+3) + \"`n`n\" + $new + $old.Substring($pos+3); Set-Content 'j:\Estern Birds\bird-website\CHANGELOG.md' $updated"

rem --- Also add version comment line to .env.local history ---
powershell -Command "$f = Get-Content 'j:\Estern Birds\bird-website\.env.local' -Raw; $line = '# v%VER%  %MSG%'; $marker = '# ============================================================'; $pos = $f.LastIndexOf($marker); $updated = $f.Substring(0,$pos) + $line + \"`n\" + $f.Substring($pos); Set-Content 'j:\Estern Birds\bird-website\.env.local' $updated"

rem --- Git commit ---
git -C "j:\Estern Birds\bird-website" add -A
git -C "j:\Estern Birds\bird-website" commit -m "v%VER% - %MSG%"

echo.
echo  ==========================================
echo   Saved as v%VER%: %MSG%
echo   Date: %TODAY%
echo  ==========================================
echo.
echo  Run versions.bat to see full history.
echo.
pause
