@echo off
cd /d "%~dp0"
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Fix ntfy notification: HTTP headers cannot contain Hebrew text"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
