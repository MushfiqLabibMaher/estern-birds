@echo off
echo.
echo  ==========================================
echo   Estern Birds — Version History
echo  ==========================================
echo.

rem --- Show current version from .env.local ---
for /f "tokens=2 delims==" %%V in ('findstr "APP_VERSION" "j:\Estern Birds\bird-website\.env.local"') do set CURVER=%%V
echo  Current version: v%CURVER%
echo.

rem --- Show git log ---
echo  Git commits:
echo  ------------
git -C "j:\Estern Birds\bird-website" log --oneline --decorate
echo.

rem --- Show CHANGELOG ---
echo  Changelog:
echo  ----------
type "j:\Estern Birds\bird-website\CHANGELOG.md"
echo.

echo  ==========================================
echo   To REVERT to a version:
echo     1. Copy the 7-letter ID from git commits above
echo     2. Open a terminal and run:
echo        git -C "j:\Estern Birds\bird-website" checkout [ID] -- .
echo.
echo   To go back to LATEST after reverting:
echo        git -C "j:\Estern Birds\bird-website" checkout master -- .
echo  ==========================================
echo.
pause
