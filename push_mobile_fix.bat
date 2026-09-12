@echo off
cd /d "%~dp0"
echo === git status before ===
git status
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Fix mobile layout: header/nav stacking, hero, forms and lists now fit phone widths"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
