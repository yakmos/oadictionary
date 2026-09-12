@echo off
cd /d "%~dp0"
echo === git init ===
git init
echo === git add ===
git add .
echo === git commit ===
git commit -m "OADictionary v2 - modern rebuild on Firebase"
echo === gh repo create + push ===
gh repo create oadictionary --public --source=. --remote=origin --push
echo.
echo === DONE - check messages above for errors ===
pause
