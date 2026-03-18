@echo off
setlocal enabledelayedexpansion

echo === Git Auto Push ===
echo.

:: Check if git repo
git status >nul 2>&1
if errorlevel 1 (
    echo Error: Not a git repository
    pause
    exit /b 1
)

:: Check for changes
for /f %%i in ('git status -s') do set HAS_CHANGES=1
if not defined HAS_CHANGES (
    echo No changes to commit
    pause
    exit /b 0
)

:: Show status
echo Current changes:
git status -s
echo.

:: Get commit message
if "%~1"=="" (
    set /p "commit_message=Enter commit message: "
) else (
    set "commit_message=%~1"
)

:: Use default message if empty
if "!commit_message!"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set TODAY=%%a-%%b-%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set NOW=%%a:%%b
    set "commit_message=Update !TODAY! !NOW!"
)

echo.
echo Committing...

:: Add all changes
git add .

:: Commit
git commit -m "!commit_message!"
if errorlevel 1 (
    echo Commit failed
    pause
    exit /b 1
)

:: Push to remote
echo.
echo Pushing to remote...
git push

if errorlevel 1 (
    echo.
    echo Push failed - check network or permissions
    pause
    exit /b 1
) else (
    echo.
    echo Successfully pushed to GitHub!
    timeout /t 2 >nul
)
