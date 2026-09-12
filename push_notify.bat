@echo off
cd /d "%~dp0"
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Add real-time admin push notifications via ntfy.sh on new word submissions"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
