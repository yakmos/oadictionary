@echo off
cd /d "%~dp0"
echo === git status before ===
git status
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Actually fix ntfy notification Title header (previous commit did not include the fix)"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
