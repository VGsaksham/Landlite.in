@echo on
setlocal ENABLEDELAYEDEXPANSION

REM Ensure we are in the script's directory (project root)
cd /d %~dp0

set LOGFILE=%~dp0scripts\sync.log

REM Prefer python, fallback to py launcher
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  set PYTHON_EXE=python
) else (
  where py >nul 2>&1
  if %ERRORLEVEL% EQU 0 (
    set PYTHON_EXE=py
  ) else (
    echo Python is not installed or not on PATH. Please install Python 3. 1>"%LOGFILE%" 2>&1
    echo Python is not installed or not on PATH. Please install Python 3.
    pause
    exit /b 1
  )
)

REM Run the auto sync script with repo URL and capture output to log
"%PYTHON_EXE%" scripts\auto_sync.py https://github.com/VGsaksham/Landlite.in.git 1>"%LOGFILE%" 2>&1
set RET=%ERRORLEVEL%

echo ================= SCRIPT OUTPUT (also in scripts\sync.log) ================
 type "%LOGFILE%"

echo ========================================================================
if %RET% NEQ 0 (
  echo Sync failed with error code %RET%.
  pause
  exit /b %RET%
)

echo Sync completed successfully.
pause
exit /b 0
