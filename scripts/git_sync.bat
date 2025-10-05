@echo off
setlocal

REM Windows wrapper to run the Python git sync script from repo root
REM Usage: scripts\git_sync.bat "Your commit message here"
REM Set GIT_SYNC_NO_PAUSE=1 to avoid the final pause (useful in existing terminals)

REM Determine repo root as the parent of this script's directory
set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%.."

REM Prefer py launcher; fallback to python
set "PYTHON="
where py >nul 2>nul
if %ERRORLEVEL%==0 (
  set "PYTHON=py -3"
) else (
  where python >nul 2>nul
  if %ERRORLEVEL%==0 (
    set "PYTHON=python"
  ) else (
    echo [git-sync] ERROR: Could not find Python. Install Python or add it to PATH.
    set EXITCODE=9009
    goto :finish
  )
)

set MSG=%~1
if "%MSG%"=="" (
  %PYTHON% "scripts/git_sync.py" --set-origin --branch main
) else (
  %PYTHON% "scripts/git_sync.py" --set-origin --branch main --message "%MSG%"
)

set EXITCODE=%ERRORLEVEL%

echo.
if %EXITCODE%==0 (
  echo [git-sync] Completed successfully on branch main.
) else (
  echo [git-sync] Failed with exit code %EXITCODE%.
)

:finish
if "%GIT_SYNC_NO_PAUSE%"=="" (
  echo.
  if "%EXITCODE%"=="0" (
    echo Press any key to close this window...
  ) else (
    echo Check errors above. Press any key to close this window...
  )
  pause >nul
)

popd
exit /b %EXITCODE%
