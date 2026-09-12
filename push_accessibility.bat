@echo off
cd /d "%~dp0"
echo === git status before ===
git status
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Add full WCAG 2.0 AA accessibility compliance: contrast fixes, keyboard/ARIA support, accessibility toolbar, and accessibility statement page"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
