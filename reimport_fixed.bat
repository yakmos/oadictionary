@echo off
cd /d "%~dp0"
echo === npm run import (fixed legacyId / BOM) ===
call npm run import
echo === git add ===
git add -A
echo === git commit ===
git commit -m "Fix CSV BOM handling (legacyId was NaN) and make import idempotent"
echo === git push ===
git push
echo.
echo === DONE - check messages above for errors ===
pause
