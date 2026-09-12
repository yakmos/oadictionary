@echo off
cd /d "%~dp0"
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Add admin panel (Firebase Auth) for approving/deleting pending words"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
