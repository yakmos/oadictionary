@echo off
cd /d "%~dp0"
echo === git status before ===
git status
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Redesign: recreate original OADictionary brand (logo, colors) with an upgraded rounded search hero"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
