@echo off
cd /d "%~dp0"
echo === npm install ===
call npm install
echo === npm run import ===
call npm run import
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Wire up real Firebase project config and Admin SDK import script"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
