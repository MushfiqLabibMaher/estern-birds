@echo off
echo.
echo  === Estern Birds — Version History ===
echo.
git -C "j:\Estern Birds\bird-website" log --oneline --decorate
echo.
echo  To revert to a version:
echo    git -C "j:\Estern Birds\bird-website" checkout [ID] -- .
echo  To go back to latest:
echo    git -C "j:\Estern Birds\bird-website" checkout master -- .
echo.
pause
